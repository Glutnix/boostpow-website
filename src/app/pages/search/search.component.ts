import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APIService, TimeSelectOptions } from 'src/app/_services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  faSpinner = faSpinner;
  faSearch = faSearch;
  timeSelectOptions = TimeSelectOptions;

  topic = "";
  timeframe = 86400*14;
  searchForm: FormGroup;

  subscriptions: Subscription[] = [];
  boosts = [];
  searching = false;
  searched = false;

  constructor(private api:APIService, private fb: FormBuilder, private route: ActivatedRoute, private router:Router) {
    const topic = this.route.snapshot.queryParams['topic'] || '';
    let timeframe = this.route.snapshot.queryParams['timeframe'] || 86400*14;
    if(!this.timeSelectOptions.find(o => { return o.value == timeframe})){
      timeframe = 86400*14;
    }
    this.searchForm = this.fb.group({
      topic: [topic],
      timeframe: [timeframe]
    });
    this.search();
  }

  ngOnInit(): void {
    this.subscriptions = [
      this.api.boosts.subscribe(boosts => {
        this.searching = false;
        this.boosts = boosts;
      })
    ];
  }

  async search() {
    this.searching = true;
    this.topic = this.searchForm.controls['topic'].value;
    this.timeframe = this.searchForm.controls['timeframe'].value;
    this.router.navigate(['search'], { queryParams: { topic: this.topic, timeframe: this.timeframe } });
    await this.api.searchBoost(this.topic, this.timeframe);
    this.searched = true;
  }

  async addBoost() {
    await boostPublish.open({
      label: 'Boost Content',
      content: { category: this.topic, diff: 1 },
      outputs: [],
      topic: {
        value: this.topic, 
        show: true
      },
      onPayment: async (e) => {
        console.log('onPayment', e);
        setTimeout(() => {
          console.log('timeout fired', e);
        }, 4000);
      }
    });
    return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

}
