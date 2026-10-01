import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FeedProviderService } from '../services/feed.provider.service';

import { LoadingController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-feed-upload',
  templateUrl: './feed-upload.component.html',
  styleUrls: ['./feed-upload.component.scss'],
})
export class FeedUploadComponent implements OnInit {
  previewDataUrl: string | null = null;
  file: File | null = null;
  uploadForm: FormGroup = new FormGroup({});

  constructor(
    private feed: FeedProviderService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      caption: new FormControl('', Validators.required)
    });
  }

  setPreviewDataUrl(file: Blob) {
    const reader  = new FileReader();
    reader.onloadend = () => {
      this.previewDataUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  selectImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      return;
    }
    this.file = files[0];
    this.setPreviewDataUrl(this.file);

  }

  onSubmit($event: Event) {
    $event.preventDefault();
    this.loadingController.create();

    if (!this.uploadForm.valid || !this.file) { return; }
    this.feed.uploadFeedItem(this.uploadForm.controls.caption.value, this.file)
      .then((result) => {
        this.modalController.dismiss();
        this.loadingController.dismiss();
      });
  }

  cancel() {
    this.modalController.dismiss();
  }
}