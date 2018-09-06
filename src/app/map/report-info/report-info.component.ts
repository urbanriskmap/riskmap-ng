import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ReportInterface } from '../../interfaces';
import { HttpService } from '../../services/http.service';
import { TimeService } from '../../services/time.service';
import { SanitizePipe } from '../../pipes/sanitize.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss']
})
export class ReportInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: {
    [name: string]: any
  }[];
  @Input() archivedReport: boolean;

  votes: number;
  voteSelector: number[]; // Current vote index = 1
  storedVote: number;

  env = environment;
  feature: ReportInterface;
  parsedReportData: {
    [name: string]: any
  };
  parsedTags: {
    [name: string]: any
  };
  showFlyer = {
    flag: false,
    share: false
  };
  reportTime: string;
  grades: {
    component: string,
    severity: any
  }[];
  socialButtons: {
    name: string,
    intent: string
  }[];

  @Output() showFullSizeImg = new EventEmitter<string>();

  constructor(
    private httpService: HttpService,
    public timeService: TimeService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.reportTime = this.timeService.getLocalTime(this.feature.created_at, 'LLL');

  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.reportTime = this.timeService.getLocalTime(this.feature.created_at, 'LLL');
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;
      this.reportTime = this.timeService.getLocalTime(this.feature.created_at, 'LLL');

      // Update browser url with currently selected report's id
      window.history.pushState(
        {},
        '',
        location.pathname + '?id=' + this.feature.pkey
      );

      // Parse report data
      if (this.feature.report_data) {
        if (typeof this.feature.report_data === 'string') {
          this.parsedReportData = JSON.parse(this.feature.report_data);
        } else {
          this.parsedReportData = this.feature.report_data;
        }
      }
      // // print grade of report data
      this.grades = [];
      for (const item of this.parsedReportData.damages) {
        this.grades.push( {component: item.component, severity: item.severity});
      }
      // console.log(this.grade);

      // Initialize vote selector array
      this.voteSelector = [-1, 0, 1];
      // Set votes
      this.votes = this.parsedReportData['points'] ? this.parsedReportData['points'] : 0;

      // Lookup voting history
      const vote = localStorage.getItem('id_' + this.feature.pkey);
      this.storedVote = vote ? parseInt(vote, 10) : 0;

      // [-1, 0, 1] -> [0, 1, -1]
      if (this.storedVote > 0) {
        this.voteSelector.push(this.voteSelector.shift());
        this.votes += 1;
      }
      // [-1, 0, 1] -> [1, -1, 0]
      if (this.storedVote < 0) {
        this.voteSelector.unshift(this.voteSelector.pop());
        this.votes -= 1;
      }

      // Parse tags
      if (this.feature.tags) {
        if (typeof this.feature.tags === 'string') {
          this.parsedTags = JSON.parse(this.feature.tags);
        } else {
          this.parsedTags = this.feature.tags;
        }
      }

      // Set prefill text for social media sharing
      let msgText;
      this.translate.get('report_info.msg_text').subscribe((res: string) => {
        msgText = res;
      });
      const reportUrl = encodeURIComponent(
        location.origin + location.pathname + '?id=' + this.feature.pkey
      );

      this.socialButtons = [
        {
          name: 'facebook',
          intent: 'https://www.facebook.com/sharer/sharer.php?u=' + reportUrl
        },
        {
          name: 'twitter',
          intent: 'https://twitter.com/intent/tweet?text=' + msgText + '%20' + reportUrl
        },
        // TODO: use web.whatsapp.com if isMobile = false
        {
          name: 'whatsapp',
          intent: 'https://api.whatsapp.com/send?text=' + msgText + '%20' + reportUrl
        },
        {
          name: 'telegram',
          intent: 'https://telegram.me/share/url?url=' + reportUrl + ' &text= ' + msgText
        }
      ];
    }
  }

  handleVotes(vote: '1 | -1'['type']): void {
    // close if any flyer is open
    this.toggleFlyer();

    if (vote > 0) {
      // Upvote
      // [1, -1, 0] -> [-1, 0, 1]
      // [-1, 0, 1] -> [0, 1, -1]
      this.voteSelector.push(this.voteSelector.shift());
      this.votes += 1;

    } else if (vote < 0) {
      // Downvote
      // [-1, 0, 1] -> [1, -1, 0]
      // [0, 1, -1] -> [-1, 0, 1]
      this.voteSelector.unshift(this.voteSelector.pop());
      this.votes -= 1;
    }

    localStorage.setItem(
      'id_' + this.feature.pkey,
      JSON.stringify(this.voteSelector[1])
    );

    // Submit vote
    this.httpService.updateVotes(this.feature.pkey, vote);
  }

  toggleFlyer(flyer?: string): void {
    if (flyer) {
      if (!this.showFlyer.flag && !this.showFlyer.share) {
        // case 1: both false
        this.showFlyer[flyer] = true;
        document.getElementById(flyer + 'Button').classList.add('active');

      } else {
        // either one is true
        if (this.showFlyer[flyer]) {
          // clicked on already open flyer
          this.showFlyer[flyer] = false;
          document.getElementById(flyer + 'Button').classList.remove('active');

        } else {
          // clicked on another flyer
          // close already open flyer
          if (flyer === 'share') {
            this.showFlyer.flag = false;
            document.getElementById('flagButton').classList.remove('active');
          } else if (flyer === 'flag') {
            this.showFlyer.share = false;
            document.getElementById('shareButton').classList.remove('active');
          }
          // open clicked flyer
          this.showFlyer[flyer] = true;
          document.getElementById(flyer + 'Button').classList.add('active');
        }
      }

    } else {
      // external control
      this.showFlyer.flag = false;
      this.showFlyer.share = false;
      document.getElementById('flagButton').classList.remove('active');
      document.getElementById('shareButton').classList.remove('active');
    }
  }

  ngOnDestroy(): void {
    this.features = null;
    this.feature = null;
    this.storedVote = null;

    // Update browser url, remove query param
    window.history.pushState(
      {},
      document.title,
      location.pathname
    );
  }
}
