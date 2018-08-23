/// <reference types="geojson" />

import { Component, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Feature, GeometryObject, GeoJsonProperties } from 'geojson';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import * as mapboxgl from 'mapbox-gl';

import layers from '../../resources/layers';
import { environment } from '../../environments/environment';
import instances from '../../resources/instances';
import { LayerService } from '../services/layer.service';
import { InteractionService } from '../services/interaction.service';
import { NotificationService } from '../services/notification.service';
import { TimeService } from '../services/time.service';
import { AuthService } from '../services/auth.service';
import { RegionPickerComponent } from './region-picker/region-picker.component';
import { AgreementAndPolicyComponent } from './agreement-and-policy/agreement-and-policy.component';
import { EnvironmentInterface, Region, ReportInterface } from '../interfaces';

/**
 * View model for Riskmap landing page
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [ LayerService, InteractionService ]
})
export class MapComponent implements OnInit, OnDestroy {
  adminMode = false;
  deferredPrompt: any;
  env: EnvironmentInterface = environment;
  fullSizeImgUrl: string;
  instances: {
    instanceType: string,
    regions: Region[]
  };
  languages: {
    code: string,
    name: string
  }[];
  navigationSubscription: Subscription;
  notificationSubscription: Subscription;
  openNotificationMsg: string;
  paneToOpen = 'info';
  selectedLanguage: string;
  selectedRegion: Region;
  selectedReportId: null | number;
  showSidePane = false;
  translateParams = {
    title: 'RiskMap'
  };
  viewingArchivedReport: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private layerService: LayerService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public notify: MatSnackBar,
    public translate: TranslateService,
    public timeService: TimeService,
    public authService: AuthService
  ) {
    this.instances = instances;
    this.languages = this.env.locales.supportedLanguages;

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(this.env.locales.defaultLanguage);
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(this.env.locales.defaultLanguage);

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component (landing page)
      if (e instanceof NavigationEnd) {
        this.initialiseLandingRoute();
      }
    });
  }

  initializeMap(): void {
    mapboxgl.accessToken = this.env.map.accessToken;
    this.layerService.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'mapWrapper',
      center: this.env.map.center,
      zoom: this.env.map.initZoom,
      minZoom: this.env.map.minZoom,
      style: this.env.map.baseMapStyle,
      hash: false,
      preserveDrawingBuffer: true
    });

    // Add navigation control
    this.layerService.map.addControl(
      new mapboxgl.NavigationControl(),
      'bottom-left'
    );

    // Add geolocation button
    this.layerService.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true
      }),
      'bottom-left'
    );
  }

  hasRegionParam(): boolean {
    const instance = this.route.snapshot.paramMap.get('region');

    if (this.instances.regions.length === 1) {
      // Proceed to the only instance region in deployment
      this.selectedRegion = this.instances.regions[0];
      window.history.replaceState(
        {},
        '',
        location.origin + '/' + this.selectedRegion.name
      );
      return true;
    } else {
      // Loop through supported instance regions of deployment
      for (const region of this.instances.regions) {
        // Compare region name
        if (instance === region.name) {
          this.selectedRegion = region;
          return true;
        }
      }
    }

    // Else return false, and bring up region selection popup
    return false;
  }

  getLanguageCode(langParam: string): string {
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
    this.timeService.changeTimeLocale(event.value);
  }

  storeQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      // Report id
      if (Number.isInteger(parseInt(params['id'], 10))) {
        this.selectedReportId = params['id'];
      }

      // Side pane tab
      const paneParam = params['pane'];
      for (const pane of ['info', 'map', 'report']) {
        if (paneParam === pane
          && !params['id'] // Open side pane only when report id is not queried
        ) {
          this.paneToOpen = params['pane'];
          this.toggleSidePane();
          break;
        }
      }

      // User agreement / Privacy policy
      if (params['terms']
        && !params['id'] // Open user agreement only when report id is not queried
      ) {
        this.openDialog('agreementPolicy');
      }

      // Language
      this.changeLanguage({
        value: this.getLanguageCode(params['lang'])
      });

      // AdminMode
      if (params['admin']
        && params['admin'] === 'true'
        && this.authService.isAuthorized) {
        this.adminMode = true;
      }
    });
  }

  // FIXME: may get triggered before reports layer is rendered
  // Catch in tests
  lookupQueriedReport(event): void {
    if (event.sourceId === 'reports') {
      // Iterate over report layer geojson features
      for (const report of event.source.data.features) {
        if (report.properties.pkey === this.selectedReportId) {
          // Report found in loaded dataset
          this.layerService.zoomToQueriedReport(report);
          return;
        }
      }

      // Report not found in set server timeperiod
      // Fetch from server OR notify
      this.layerService.addSingleReportToLayer(this.selectedReportId)
      .then(report => {
        // FIXME: pans anywhere across the globe,
        // check ?id=85
        this.layerService.zoomToQueriedReport(report);

        const reportsTimeperiodCutoff = this.timeService.getLocalTime(
          (new Date(
            Date.parse(
              (new Date()).toISOString()
            ) - (this.env.servers.settings.reportTimeperiod * 1000)
          )).toISOString()
        );
        const queryReportCreatedAt = this.timeService.getLocalTime(report.properties.created_at);

        // NOTE: Due to 1 minute reports caching setting on reports endpoint,
        // recently submitted reports do not show up in the reports layer,
        // causing them to be falsely tagged as 'archived reports'
        // Following check bypasses that glitch
        if (queryReportCreatedAt.isBefore(reportsTimeperiodCutoff)) {
          this.viewingArchivedReport = true;
        }
      })
      .catch(error => console.log('Queried report does not exist'));
    }
  }

  bindMapEventHandlers(): void {
    this.layerService.map.on('style.load', () => {
      if (this.selectedRegion) {
        // Fly to selected region
        this.setBounds();

        const adminMode = this.authService.isAuthorized && this.adminMode;

        // Then load layers
        this.layerService.initializeLayers(this.selectedRegion, adminMode);
      }
    });

    // Handle click interactions
    this.layerService.map.on('click', event => {
      // Clear any open panes
      this.toggleSidePane({close: true});
      this.toggleReportFlyer({close: true});

      if (this.viewingArchivedReport) {
        this.viewingArchivedReport = false;
      }
      this.layerService.handleMapInteraction(event);
    });

    let eventCall = 0;
    this.layerService.map.on('dataloading', event => {
      if (event.sourceId === 'reports'
      && this.selectedReportId) {
        // 3 dataloading calls are made per layer source
        if (eventCall === 2) {
          this.lookupQueriedReport(event);
          eventCall += 1;
        } else {
          eventCall += 1;
        }
      }
    });
  }

  initialiseLandingRoute(): void {
    // Initialise notification subscription
    this.notificationSubscription = this.notificationService.message
    .subscribe(content => {
      if (!content.skipNotification) {
        this.showNotification(content.msg, content.type);
      }
    });

    // Reset map layers, sources;
    // Clear stored values for instances
    this.initializeMap();

    if (!this.hasRegionParam()) {
      this.openDialog('pickRegion');
    } else {
      this.bindMapEventHandlers();
    }

    this.storeQueryParams();
  }

  // TODO: Mayank - stack notifications?
  // REVIEW: Mayank - use openFromComponent method to pass custom component
  showNotification(
    msg: string,
    type: 'info' | 'warn' | 'error'
  ) {
    if (this.openNotificationMsg) {
      this.notify.dismiss();
      // msg = msg + '; ' + this.openNotificationMsg;
    }

    const notification = this.notify.open(msg, '✕', {
      duration: 30000,
      verticalPosition: 'top',
      panelClass: ['notification-bar', 'notify-' + type]
    });

    notification.afterOpened().subscribe(() => {
      // Store state
      this.openNotificationMsg = msg;
    });

    notification.onAction().subscribe(() => {
      // Dismiss notification
      notification.dismiss();
    });

    notification.afterDismissed().subscribe(() => {
      // Store state
      this.openNotificationMsg = '';
    });
  }

  ngOnInit(): void {
    // Stash event so it can be triggered later
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;

      return false;
    });
  }

  setBounds(): void {
    this.layerService.map.fitBounds([
      this.selectedRegion.bounds.sw,
      this.selectedRegion.bounds.ne
    ]);
  }

  openDialog(content: string): void {
    let dialogRef;

    if (content === 'pickRegion') {
      dialogRef = this.dialog
      .open(RegionPickerComponent, {
        width: '320px',
        data: this.instances.regions
      });

      // Can only be closed by selecting an option
      dialogRef.disableClose = true;

    } else if (content === 'agreementPolicy') {
      dialogRef = this.dialog.open(AgreementAndPolicyComponent, {
        width: '420px',
        data: null
      });
    }

    this.toggleSidePane({close: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.closeInfoPane(); // Close any panes if open
        this.router.navigate([result.name]);
      }
    });
  }

  // COMBAK add to home screen prompt
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

  toggleSidePane(forceAction?: {close: boolean}): void {
    if (this.showSidePane || (forceAction && forceAction.close)) {
      // Close
      this.showSidePane = false;
    } else if (!this.showSidePane) {

      // Open
      this.showSidePane = true;
      // Force close report flooding flyer
      this.toggleReportFlyer({close: true});
      // Call handleMapInteraction without params
      // to clear any selected features and close any open panes
      this.layerService.handleMapInteraction();
    }
  }

  closeInfoPane(): void {
    // Call handleMapInteraction without params
    // to clear any selected features and close any open panes
    this.layerService.handleMapInteraction();
  }

  closeImgPreview(): void {
    this.fullSizeImgUrl = null;
  }

  toggleReportFlyer(forceAction?: {close: boolean}): void {
    const reportFlyer = document.getElementById('reportFlyer');
    const flyerState = reportFlyer.style.display;

    if (flyerState === 'block' || (forceAction && forceAction.close)) {
      // is expanded
      reportFlyer.style.display = 'none';

    } else {
      // is closed
      reportFlyer.style.display = 'block';
      // Call toggleSidePane with force close
      this.toggleSidePane({close: true});
      // Call handleMapInteraction without params
      // to clear any selected features and close any open panes
      this.layerService.handleMapInteraction();
    }
  }

  parseFullSizeImgUrl(url: string): void {
    if (url) {
      this.fullSizeImgUrl = url.replace(/(\/[-a-zA-Z0-9]*)(?=\.jpg)/, '/large' + '$1');
    }
  }

  logoutUser(): void {
    this.adminMode = false;
    this.authService.logoutUser();
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + this.selectedRegion.name]);
  }

  getFeatures(layer: string, root?: true) {
    const features = root ? this.layerService.interactionService[layer]
      : this.layerService.interactionService.featureTypes[layer];

    if (features && features.length) {
      return features;
    }

    return false;
  }

  ngOnDestroy(): void {
    // Required when app has more than one route, eg. /login
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseLandingRoute()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
