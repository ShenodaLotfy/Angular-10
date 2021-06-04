import { AbstractControl } from '@angular/forms';

export class CustomValidator {
    // custom validator function using (inner and outter functions(javascript closure ))
    static emailDomain(emailDomain: string) { // this is function takes email domain as a parameter 
        // returns a function ( arrow function ) that makes the domain validation
        return (control: AbstractControl): { [key: string]: any } | null => { // null in case of success, object in case of erros occured
            const email: string = control.value;
            const domain = email.substring(email.lastIndexOf("@") + 1);
            //check if string isnt null
            if (email === '' || domain.toLowerCase() === emailDomain.toLowerCase()) {
                return null; // no errors
            } else {
                return { 'emailDomain': true };
            }
        };
    }

}