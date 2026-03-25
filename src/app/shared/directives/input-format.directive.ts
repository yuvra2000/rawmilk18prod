import { Directive, Input, HostListener, inject, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Defines the complete set of formatting rules that can be applied to an input.
 * All properties are optional, allowing for flexible configuration.
 */
export interface InputFormatConfig {
  /**
   * Defines the character case transformation applied during input.
   * - `uppercase`: Converts all characters to uppercase (e.g., "TEXT").
   * - `lowercase`: Converts all characters to lowercase (e.g., "text").
   * - `titlecase`: Capitalizes the first letter of every word (e.g., "Title Case").
   * - `capitalize`: Capitalizes only the first letter of the entire input (e.g., "Sentence case").
   */
  case?: 'uppercase' | 'lowercase' | 'titlecase' | 'capitalize';

  /**
   * Restricts the allowed characters in real-time as the user types.
   * - `numbers-only`: Allows only digits (0-9).
   * - `alpha-only`: Allows only alphabetic characters and single spaces.
   */
 filter?: 'numbers-only'|'numbers-decimal'| 'alpha-only' | 'alphanumeric-only';

  /**
   * If true, replaces multiple consecutive spaces with a single space during input.
   */
  sanitizeSpaces?: boolean;

  /**
   * If true, removes leading and trailing whitespace when the user leaves the input field (on blur).
   */
  autoTrim?: boolean;
  /**
   * If true, prevents the user from entering leading spaces in the input.
   * This is enforced during typing.
   */
  preventLeadingSpaces?: boolean;
  maxLength?: number;
}

@Directive({
  selector: '[appInputFormat]',
  standalone: true,
})
export class InputFormatDirective {
  /**
   * The main configuration object that drives all formatting logic.
   * The directive remains inactive if this is null or undefined.
   */
  @Input('appInputFormat') config: InputFormatConfig | null = null;
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly ngControl = inject(NgControl, { optional: true });
  
  // ✅ Cache regex patterns to avoid recreation
  private static readonly REGEX_CACHE = {
    numbersOnly: /[^0-9]/g,
    numbersDecimal: /[^0-9.]/g,
    alphaOnly: /[^a-zA-Z\s]/g,
    alphanumericOnly: /[^a-zA-Z0-9\s]/g,
    multipleSpaces: /\s+/g,
    leadingSpaces: /^\s+/,
  };

  // constructor(private control: NgControl) {}

  /**
   * Listens for every keystroke to apply real-time formatting rules.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
   if (!this.config || !this.ngControl?.control) return;


   const inputElement = this.elementRef.nativeElement;
    let value = inputElement.value;
    const originalValue = value;
    const cursorPosition = inputElement.selectionStart || 0;

  
    // ✅ Early return for empty values
    if (!value) return;

    // ✅ Apply transformations in optimal order
    // --- Step 1: Character Filtering (Highest Priority) ---
    // This runs first to immediately remove any unwanted characters.
    value = this.applyFiltering(value);

    // --- Step 3: Case Transformation ---
    // Applies the desired casing to the cleaned-up value.
    value = this.applyCaseTransformation(value);
    
     // --- Step 2: Sanitize Extra Whitespace ---
    // This cleans up spacing before case transformations are applied.
    value = this.applySpaceSanitization(value);

    value = this.applyLengthLimit(value);

       // ✅ Only update if value actually changed
    if (value !== originalValue) {
      this.updateValueAndCursor(inputElement, value, cursorPosition, originalValue);
    }

 
  }

  /**
   * Listens for when the user leaves the input field to apply final cleanup.
   */
  @HostListener('blur')
  onBlur(): void {
    // --- Auto-trimming on blur ---
    // This is done on blur to avoid disrupting the user's typing experience (e.g., typing a space at the end).
     if (!this.config?.autoTrim || !this.ngControl?.control) return;
    
    const currentValue = this.ngControl.control.value;
    if (typeof currentValue === 'string') {
      const trimmedValue = currentValue.trim();
      if (trimmedValue !== currentValue) {
        this.ngControl.control.setValue(trimmedValue, { emitEvent: true });
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (!this.config) return;
    
    // ✅ Process paste content
    setTimeout(() => this.onInput(event), 0);
  }
 ngOnDestroy(): void {
    // ✅ Clean up any references if needed
  }

    private applyFiltering(value: string): string {
    if (!this.config?.filter) return value;

    switch (this.config.filter) {
      case 'numbers-only':
        return value.replace(InputFormatDirective.REGEX_CACHE.numbersOnly, '');
        case 'numbers-decimal': // ✅ NEW CASE
      // 1. Pehle digits aur dot (.) ke alawa sab kuch hata do
      let cleanDecimal = value.replace(InputFormatDirective.REGEX_CACHE.numbersDecimal, '');
      
      // 2. Logic: Sirf ek decimal allow karein
      const firstDotIndex = cleanDecimal.indexOf('.');
      if (firstDotIndex >= 0) {
        // Pehle dot ke baad wale hisse se saare dots hata do
        const beforeDot = cleanDecimal.substring(0, firstDotIndex + 1);
        const afterDot = cleanDecimal.substring(firstDotIndex + 1).replace(/\./g, '');
        return beforeDot + afterDot;
      }
      return cleanDecimal;
      case 'alpha-only':
        return value.replace(InputFormatDirective.REGEX_CACHE.alphaOnly, '');
      case 'alphanumeric-only':
        return value.replace(InputFormatDirective.REGEX_CACHE.alphanumericOnly, '');
      default:
        return value;
    }
  }
  // ✅ Optimized case transformation
  private applyCaseTransformation(value: string): string {
    if (!this.config?.case) return value;

    switch (this.config.case) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'titlecase':
        return this.toTitleCase(value);
      case 'capitalize':
        return this.toCapitalize(value);
      default:
        return value;
    }
  }

   private applySpaceSanitization(value: string): string {
    if (!this.config?.sanitizeSpaces && !this.config?.preventLeadingSpaces) {
      return value;
    }

    if (this.config.preventLeadingSpaces) {
      value = value.replace(InputFormatDirective.REGEX_CACHE.leadingSpaces, '');
    }

    if (this.config.sanitizeSpaces) {
      value = value.replace(InputFormatDirective.REGEX_CACHE.multipleSpaces, ' ');
    }

    return value;
  }
 // ✅ Length limiting
  private applyLengthLimit(value: string): string {
    if (!this.config?.maxLength) return value;
    return value.slice(0, this.config.maxLength);
  }

    // ✅ Optimized cursor position management
  private updateValueAndCursor(
    inputElement: HTMLInputElement, 
    newValue: string, 
    originalCursor: number,
    originalValue: string
  ): void {
    const lengthDiff = newValue.length - originalValue.length;
    const newCursorPosition = Math.max(0, originalCursor + lengthDiff);

    inputElement.value = newValue;
    this.ngControl!.control!.setValue(newValue, { emitEvent: false });

    // ✅ Use requestAnimationFrame for smooth cursor positioning
    requestAnimationFrame(() => {
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }
  /**
   * Helper function to convert a string to Title Case.
   * Example: "hello world" -> "Hello World"
   */
  // ✅ Optimized with early returns
  private toTitleCase(value: string): string {
    if (!value) return value;
    return value.replace(/\b\w+/g, (word) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }

  /**
   * Helper function to capitalize only the first letter of a string.
   * Example: "hello world" -> "Hello world"
   */
  // ✅ Optimized capitalize
  private toCapitalize(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
