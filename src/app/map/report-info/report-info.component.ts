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
  voteSelector = [-1, 0, 1]; // Current vote index = 1

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
    if (changes.hasOwnProperty('features')) {
      this.feature = this.features[0].properties;

      if (this.feature.report_data) {
        if (typeof this.feature.report_data === 'string') {
          this.parsedReportData = JSON.parse(this.feature.report_data);
        } else {
          this.parsedReportData = this.feature.report_data;
        }
      }

      // Set votes
      this.votes = this.parsedReportData['points'] ? this.parsedReportData['points'] : 0;

      // Lookup voting history
      const storedVote = localStorage.getItem('id_' + this.feature.pkey);
      if (storedVote) {
        // [-1, 0, 1] -> [0, 1, -1]
        if (parseInt(storedVote, 10) > 0) this.voteSelector.push(this.voteSelector.shift());
        // [-1, 0, 1] -> [1, -1, 0]
        if (parseInt(storedVote, 10) < 0) this.voteSelector.unshift(this.voteSelector.pop());
      }

      if (this.feature.tags) {
        if (typeof this.feature.tags === 'string') {
          this.parsedTags = JSON.parse(this.feature.tags);
        } else {
          this.parsedTags = this.feature.tags;
        }
      }

      let msgText;
      this.translate.get('report_info.msg_text').subscribe((res: string) => {
        msgText = res;
      });
      const reportUrl = location.href + '%3Freport_id%3D' + this.feature.pkey;

      this.socialButtons = [
        {
          name: 'twitter',
          intent: 'https://twitter.com/intent/tweet?text=' + msgText + '%20' + reportUrl
        },
        {
          name: 'telegram',
          intent: 'https://telegram.me/share/url?url=' + reportUrl + ' &text= ' + msgText
        },
        {
          name: 'whatsapp',
          intent: 'https://api.whatsapp.com/send?text=' + msgText + '%20' + reportUrl
        },
        {
          name: 'facebook',
          intent: 'https://www.facebook.com/sharer/sharer.php?u=' + reportUrl
        }
      ];
    }
  }

  handleVotes(vote: number): void {
    // close if any flyer is open
    this.toggleFlyer();

    if (vote > 0) {
      // Upvote
      if (this.voteSelector[1] > 0) {
        // Reset
        // [0, 1, -1] -> [-1, 0, 1]
        this.voteSelector.unshift(this.voteSelector.pop());
        this.votes -= 1;
      } else {
        // [1, -1, 0] -> [-1, 0, 1]
        // [-1, 0, 1] -> [0, 1, -1]
        this.voteSelector.push(this.voteSelector.shift());
        this.votes += 1;
      }

    } else if (vote < 0) {
      // Downvote
      if (this.voteSelector[1] < 0) {
        // Reset
        // [1, -1, 0] -> [-1, 0, 1]
        this.voteSelector.push(this.voteSelector.shift());
        this.votes += 1;
      } else {
        // [-1, 0, 1] -> [1, -1, 0]
        // [0, 1, -1] -> [-1, 0, 1]
        this.voteSelector.unshift(this.voteSelector.pop());
        this.votes -= 1;
      }
    }

    localStorage.setItem(
      'id_' + this.feature.pkey,
      JSON.stringify(this.voteSelector[1])
    );
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
          // clicked on other
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
    // Submit client votes when report info pane closes
    // COMBAK: Submit votes every time user clicks?
    if (this.votes) {
      this.httpService.updateVotes(this.feature.pkey, this.votes);
    }
    this.features = null;
    this.feature = null;
  }
}
