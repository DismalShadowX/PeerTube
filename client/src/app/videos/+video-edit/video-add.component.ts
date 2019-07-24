import { Component, HostListener, ViewChild } from '@angular/core'
import { CanComponentDeactivate } from '@app/shared/guards/can-deactivate-guard.service'
import { VideoImportUrlComponent } from '@app/videos/+video-edit/video-add-components/video-import-url.component'
import { VideoUploadComponent } from '@app/videos/+video-edit/video-add-components/video-upload.component'
import { ServerService } from '@app/core'
import { VideoImportTorrentComponent } from '@app/videos/+video-edit/video-add-components/video-import-torrent.component'

@Component({
  selector: 'my-videos-add',
  templateUrl: './video-add.component.html',
  styleUrls: [ './video-add.component.scss' ]
})
export class VideoAddComponent implements CanComponentDeactivate {
  @ViewChild('videoUpload', { static: false }) videoUpload: VideoUploadComponent
  @ViewChild('videoImportUrl', { static: false }) videoImportUrl: VideoImportUrlComponent
  @ViewChild('videoImportTorrent', { static: false }) videoImportTorrent: VideoImportTorrentComponent

  secondStepType: 'upload' | 'import-url' | 'import-torrent'
  videoName: string

  constructor (
    private serverService: ServerService
  ) {}

  onFirstStepDone (type: 'upload' | 'import-url' | 'import-torrent', videoName: string) {
    this.secondStepType = type
    this.videoName = videoName
  }

  onError () {
    this.videoName = undefined
    this.secondStepType = undefined
  }

  @HostListener('window:beforeunload', [ '$event' ])
  onUnload (event: any) {
    const { text, canDeactivate } = this.canDeactivate()

    if (canDeactivate) return

    event.returnValue = text
    return text
  }

  canDeactivate (): { canDeactivate: boolean, text?: string} {
    if (this.secondStepType === 'upload') return this.videoUpload.canDeactivate()
    if (this.secondStepType === 'import-url') return this.videoImportUrl.canDeactivate()
    if (this.secondStepType === 'import-torrent') return this.videoImportTorrent.canDeactivate()

    return { canDeactivate: true }
  }

  isVideoImportHttpEnabled () {
    return this.serverService.getConfig().import.videos.http.enabled
  }

  isVideoImportTorrentEnabled () {
    return this.serverService.getConfig().import.videos.torrent.enabled
  }
}
