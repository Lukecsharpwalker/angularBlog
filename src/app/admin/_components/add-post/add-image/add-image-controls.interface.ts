import { FormControl } from "@angular/forms";

export interface AddImageForm {
  src: FormControl<string>;
  alt: FormControl<string>;
}

