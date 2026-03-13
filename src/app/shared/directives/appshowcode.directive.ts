import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowCode]',
})

export class AppshowcodeDirective {
  private isCodeVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    const cardElement = this.el.nativeElement.closest('.card');
    if (cardElement) {
       const cardBody = this.el.nativeElement.closest('.card').querySelector('.card-body');
      const cardFooter = cardElement.querySelector('.card-footer');
      const button = this.el.nativeElement; // Get the button element
      const icon = button.querySelector('i'); // Get the <i> element inside the button

      if (cardBody && cardFooter && icon) {
        cardBody.classList.toggle('d-none');
        cardFooter.classList.toggle('d-none');

        // Get the HTML content and remove Angular-specific attributes
        let codeContent = cardBody.innerHTML;

        // Remove _ngcontent-* attributes
        codeContent = codeContent.replace(/ _ngcontent-[\w-]+=""/g, '');

        // Remove ng-reflect-* attributes
        codeContent = codeContent.replace(/ ng-reflect-\w+(?:-\w+)*="[^"]*"/g, '');

        // Optionally, format the code for better readability
        codeContent = codeContent
          .replace(/<\/\w+>/g, '$&\n\n')  // Add newlines after closing tags
          .replace(/^\s+/gim, '');       // Remove leading spaces

        cardFooter.innerText = codeContent;

        // Toggle the state and the icon class
        this.isCodeVisible = !this.isCodeVisible;
        if (this.isCodeVisible) {
          this.renderer.removeClass(icon, 'ri-code-line');
          this.renderer.addClass(icon, 'ri-code-s-slash-line');
        } else {
          this.renderer.removeClass(icon, 'ri-code-s-slash-line');
          this.renderer.addClass(icon, 'ri-code-line');
        }
      }
    }
  }

}
