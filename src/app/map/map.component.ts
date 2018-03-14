import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';

import * as mapboxgl from 'mapbox-gl';

import { environment } from '../../environments/environment';
import { LayerService } from '../services/layer.service';
import { InteractionService } from '../services/interaction.service';
import { ScreenPopupComponent } from './screen-popup/screen-popup.component';

/**
 * View model for Riskmap landing page
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  env = environment;
  navigationSubscription;
  title: 'RiskMap';
  languages: {
    code: string,
    name: string
  }[];
  selectedLanguage: string;
  selectedRegion: {
    name: string,
    code: string,
    bounds: {
      sw: number[],
      ne: number[]
    }
  };
  selectedReportId: null|number;
  paneToOpen: string;
  deferredPrompt: any;
  showSidePane = false;

  @Output() map: mapboxgl.Map;
  // Use ngx-translate-messageformat-compiler for pluralization, etc

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private translate: TranslateService,
    public layerService: LayerService,
    public interactionService: InteractionService
  ) {
    this.languages = this.env.locales.supportedLanguages;

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(this.env.locales.defaultLanguage);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(this.env.locales.defaultLanguage);

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initializeMap() {
    mapboxgl.accessToken = this.env.map.accessToken;
    this.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'mapWrapper',
      center: this.env.map.center,
      zoom: this.env.map.initZoom,
      minZoom: this.env.map.minZoom,
      style: this.env.map.baseMapStyle,
      hash: false,
      preserveDrawingBuffer: true
    });
  }

  hasRegionParam() {
    const instance = this.route.snapshot.paramMap.get('region');

    for (const region of this.env.instances.regions) {
      if (instance === region.name) {
        this.selectedRegion = region;
        return true;
      }
    }

    return false;
  }

  validateLangParam(langParam) {
    for (const lang of this.languages) {
      if (langParam === lang.code) {
        return lang.code;
      }
    }

    return this.env.locales.defaultLanguage;
  }

  changeLanguage(event): void {
    this.selectedLanguage = event.value;
    this.translate.use(event.value);
  }

  storeQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      if (Number.isInteger(parseInt(params['id'], 10))) {
        this.selectedReportId = params['id'];
      }

      const paneParam = params['pane'];
      for (const pane of ['report', 'map', 'about']) {
        if (paneParam === pane) {
          this.paneToOpen = params['pane'];
        }
      }

      this.changeLanguage({
        value: this.validateLangParam(params['lang'])
      });
    });
  }

  bindMapEventHandlers() {
    this.map.on('style.load', () => {
      if (this.selectedRegion) {
        // Fly to selected region
        this.setBounds();
        // Then load layers
        this.layerService.initializeLayers(this.map, this.selectedRegion);

        if (this.selectedReportId) {
          // Do something
          console.log('Selected report id: ' + this.selectedReportId);
        }
      }
    });

    // Handle click interactions
    this.map.on('click', event => {
      this.toggleSidePane({close: true});
      this.layerService.handleMapInteraction(event);
    });
  }

  initialiseInvites() {
    this.initializeMap();

    this.storeQueryParams();

    if (!this.hasRegionParam()) {
      this.openDialog();
    } else {
      this.bindMapEventHandlers();
    }
  }

  ngOnInit() {
    // Stash event so it can be triggered later
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;

      return false;
    });
  }

  setBounds(): void {
    this.map.fitBounds([
      this.selectedRegion.bounds.sw,
      this.selectedRegion.bounds.ne
    ]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScreenPopupComponent, {
      width: '320px',
      data: this.env.instances.regions
    });

    this.toggleSidePane({close: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeInfoPane(); // Close any panes if open
        this.router.navigate([result.name]);
      }
    });
  }

  // Ref https://developers.google.com/web/fundamentals/app-install-banners/
  addToHomeScreen(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice
      .then(choiceResult => {
        if (choiceResult.outcome === 'dismissed') {
          console.log('User cancelled A2HS');
        } else {
          console.log('User accepted A2HS');
        }

        this.deferredPrompt = null;
      });
    }
  }

  toggleSidePane(forceAction?: {close: boolean}) {
    if (this.showSidePane || (forceAction && forceAction.close)) {
      // Close
      this.showSidePane = false;
    } else if (!this.showSidePane || (forceAction && !forceAction.close)) {
      // Open
      this.showSidePane = true;

      // Call handleMapInteraction without params
      // to clear any selected features and close any open panes
      this.layerService.handleMapInteraction();
    }
  }

  closeInfoPane() {
    // Call handleMapInteraction without params
    // to clear any selected features and close any open panes
    this.layerService.handleMapInteraction();
  }

  ngOnDestroy() {
  // Required when app has more than one route, eg. /dashboard

  //   // avoid memory leaks here by cleaning up after ourselves. If we
  //   // don't then we will continue to run our initialiseInvites()
  //   // method on every navigationEnd event.
  //   if (this.navigationSubscription) {
  //      this.navigationSubscription.unsubscribe();
  //   }
  }
}
