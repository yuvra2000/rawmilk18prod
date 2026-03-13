import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'spk-blog-image-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './spk-blog-image-card.component.html',
  styleUrl: './spk-blog-image-card.component.scss'
})
export class SpkBlogImageCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() readMoreLink: string = '';
  @Input() authorName: string = '';
  @Input() authorImage: string = '';
  @Input() postDate: string = '';
  @Input() postImageTop: string = '';
  @Input() ImagePlacementBottom: boolean = false;
  @Input() ImagePlacementTop: boolean = false;
  @Input() wishlistFooterCard: boolean = false;
  @Input() dateFooterCard: boolean = false;
}
