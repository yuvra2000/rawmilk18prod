import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-team-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-team-card.component.html',
  styleUrl: './spk-team-card.component.scss'
})
export class SpkTeamCardComponent {
  @Input() name!: string;
  @Input() role!: string;
  @Input() avatarClass!: string;
  @Input() image!: string;
  @Input() description!: string;
  @Input() roleClass!: string;
  @Input() skills!: string[];
  @Input() socialLinks!: { color: string; icon: string; link: string }[];
}
