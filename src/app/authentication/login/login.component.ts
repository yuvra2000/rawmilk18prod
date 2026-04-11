import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { AppStateService } from '../../shared/services/app-state.service';
import { NgIf } from '../../../../node_modules/@angular/common/index';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public showPassword: boolean = false;

  toggleClass = 'ri-eye-off-line';
  active = 'Angular';
  firestoreModule: any;
  databaseModule: any;
  authModule: any;
  show_html: boolean = true;

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }
  disabled = '';
  // public localdata:any=this.appStateService;

  constructor(
    private elementRef: ElementRef,
    public authservice: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private appStateService: AppStateService,
  ) {
    document.body.classList.add('authentication-background');
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    htmlElement.removeAttribute('style');
  }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      UserId: ['', [Validators.required]],
      Password: ['', Validators.required],
      GroupId: ['', Validators.required],
    });
    this.access_token();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('authentication-background');
  }

  // firebase
  email = '';
  Password = '';
  GroupId = '';
  errorMessage = ''; // validation _error handle
  _error: { name: string; message: string } = { name: '', message: '' }; // for firbase _error handle
  clearErrorMessage() {
    this.errorMessage = '';
    this._error = { name: '', message: '' };
  }

  access_token() {
    var token = this.router.url;
    var k = token.split('?exttkn=');
    if (k[1] !== undefined) {
      var acc = k[1];
      if (acc == undefined) {
      } else {
        this.show_html = false;
        this.Access(acc);
      }
    }
  }

  Access(acc: any) {
    this.clearErrorMessage();
    const formData = new FormData();
    formData.append('AccessToken', acc);
    // if (this.validateForm(this.loginForm.controls['userid'].value, this.loginForm.controls['Password'].value)) {
    this.authservice.Access(formData).subscribe(async (resp: any) => {
      console.log('login123', resp);
      if (resp.Status === 'error') {
        alert(resp.Result);
        localStorage.clear();

        location.href = 'https://dairybeta.secutrak.in/logout';
      } else {
        // console.log(resp)
        localStorage.clear();

        // localStorage.setItem('Json', '1');
        localStorage.setItem('AccessToken', acc);
        localStorage.setItem('GroupId', resp.Data.GroupId);
        localStorage.setItem('AccountType', resp.Data.AccountType);
        // localStorage.setItem('UserName1', resp.Data.UserName);
        localStorage.setItem('UserName', resp.Data.AccountName);
        localStorage.setItem('GroupType', resp.Data.GroupType);
        localStorage.setItem('GroupTypeId', resp.Data.GroupTypeId);
        localStorage.setItem('AccountId', resp.Data.AccountId);
        localStorage.setItem('usertype', resp.Data.UserType);
        localStorage.setItem('AccessMenu', JSON.stringify(resp.AccessMenu));
        localStorage.setItem('supplier_id', resp.Data.supplier_id);
        localStorage.setItem('supplier_code', resp.Data.supplier_code);
        localStorage.setItem('mccid', resp.Data.mcc_id);
        localStorage.setItem('mccname', resp.Data.mcc_name);
        localStorage.setItem('mcccode', resp.Data.mcc_code);
        localStorage.setItem('directDispatch', resp.Data.direct_dispatch);
        localStorage.setItem('makerchecker', resp.Data.MakerChecker);
        localStorage.setItem('mcm', resp.Data.MCM);
        localStorage.setItem('termsAccepted', resp.Data.termAccepted);
        const formData = new FormData();
        formData.append('AccessToken', acc);
        const res: any = await firstValueFrom(
          this.authservice.loginByAccessToken(formData),
        );
        localStorage.setItem('SegmentType', res.Data.SegmentType);

        if (resp.Data.GroupId == 5938) {
          this.router.navigate(['/cart-dashboard']);
        } else {
          this.router.navigate(['/trip-dashboard']);
        }
        //           if (resp.Data.termAccepted == 1) {

        //              if (resp.Data.remoteLocation_based == 1){
        //               localStorage.setItem('showRemoteLkUnkSidebar', '/Dairy/LockUnlock');
        //             }

        //         if (resp.Data.UserType === "Manager" || resp.Data.UserType === "Regulatory Officer" || resp.Data.UserType === "Regulatory Approval") {
        //           // this.router.navigate(['/Retail/Transport']);
        //           if(resp.Data.MCM=='1'){
        //             this.router.navigate(['/Dairy/tripDashboard']);
        //                localStorage.setItem('pathtripcol','/Dairy/tripDashboard')
        //                 localStorage.setItem('Titletripcol', 'Trip Dashboard Collection');
        //           }else{
        //           this.router.navigate(['/Dairy/trip_Dashboard']);
        //           }
        //           localStorage.setItem('path', '/Dairy/ViewIndent');
        //           localStorage.setItem('Title', 'View Indent');
        //           // localStorage.setItem('path2','/Dairy/AddUploadIndent')
        //           // localStorage.setItem('Title2', 'Add/Upload Indent');
        //           localStorage.setItem('path3', '/Dairy/trip_Dashboard')
        //           localStorage.setItem('Title3', 'Trip Dashboard');
        //           localStorage.setItem('path2', '/Dairy/Inventory')
        //           localStorage.setItem('Title2', 'Inventory');
        //           localStorage.setItem('path4', '/Dairy/projection')
        //           localStorage.setItem('Title4', 'Projection');
        //           localStorage.setItem('pathhome', 'https://beta.secutrak.in/secutrak/?exttkn=' + acc!)
        //           localStorage.setItem('Titlehome', 'Home');
        //           localStorage.setItem('pathreport', '/Dairy/TripTanker')
        //           localStorage.setItem('Titlereport', 'Tanker Wise');
        //           localStorage.setItem('pathreport1', '/Dairy/TripIndent')
        //           localStorage.setItem('Titlereport1', 'Indent Wise');
        //           localStorage.setItem('pathreport2', '/Dairy/TripMPC')
        //           localStorage.setItem('Titlereport2', 'MPC Wise');
        //           localStorage.setItem('pathreport3', '/Dairy/Alert_report')
        //           localStorage.setItem('Titlereport3', 'Alert Report');
        //           localStorage.setItem('pathLoadpla', '/Dairy/loadPlanning')
        //           localStorage.setItem('TitleLoadpla', 'Load Planning');
        //           localStorage.setItem('pathSummrized', '/Dairy/summarized_Report')
        //           localStorage.setItem('TitleSummrized', 'Summarized Report');
        //           localStorage.setItem('pathdis', '/Dairy/dispatch_planning_report')
        //           localStorage.setItem('Titledis', 'Dispatch Planning');
        //           localStorage.setItem('pathstoppage','/Billing/Stoppages')
        //           localStorage.setItem('Titletoppage', 'Summary Report');

        //         }
        //         else if (resp.Data.UserType === "Supplier") {
        //           // this.router.navigate(['/Retail/summary']);
        //             if(resp.Data.MCM=='1'){
        //             this.router.navigate(['/Dairy/tripDashboard']);
        //               localStorage.setItem('pathtripcol','/Dairy/tripDashboard')
        //                 localStorage.setItem('Titletripcol', 'Trip Dashboard Collection');
        //           }else{
        //             if(resp.Data.direct_dispatch=="1"){
        //             this.router.navigate(['/Dairy/trip_Dashboard']);
        //           }else{
        //           this.router.navigate(['/Dairy/ViewIndentS']);
        //           }
        //           }
        //           localStorage.setItem('path', '/Dairy/ViewIndentS');
        //           localStorage.setItem('Title', 'View Indent');
        //           localStorage.setItem('path3', '/Dairy/trip_Dashboard')
        //           localStorage.setItem('Title3', 'Trip Dashboard');
        //           localStorage.setItem('path2', '/Dairy/Inventory')
        //           localStorage.setItem('Title2', 'Inventory');
        //           localStorage.setItem('path4', '/Dairy/projection')
        //           localStorage.setItem('Title4', 'Projection');
        //           localStorage.setItem('pathhome', 'https://beta.secutrak.in/secutrak/?exttkn=' + acc!)
        //           localStorage.setItem('Titlehome', 'Home');
        //           localStorage.setItem('pathreport', '/Dairy/TripTanker')
        //           localStorage.setItem('Titlereport', 'Tanker Wise');
        //           localStorage.setItem('pathreport1', '/Dairy/TripIndent')
        //           localStorage.setItem('Titlereport1', 'Indent Wise');
        //           localStorage.setItem('pathreport2', '/Dairy/TripMPC')
        //           localStorage.setItem('Titlereport2', 'MPC Wise');
        //           localStorage.setItem('pathreport3', '/Dairy/Alert_report')
        //           localStorage.setItem('Titlereport3', 'Alert Report');
        //           localStorage.setItem('pathLoadpla', '/Dairy/loadPlanning')
        //           localStorage.setItem('TitleLoadpla', 'Load Planning');
        //           localStorage.setItem('pathdis', '/Dairy/dispatch_planning_report')
        //           localStorage.setItem('Titledis', 'Dispatch Planning');

        //         }
        //         else if (resp.Data.UserType === "ChillingPlant") {
        //           // this.router.navigate(['/Retail/summary']);
        //              if(resp.Data.MCM=='1'){
        //             this.router.navigate(['/Dairy/tripDashboard']);
        //               localStorage.setItem('pathtripcol','/Dairy/tripDashboard')
        //                 localStorage.setItem('Titletripcol', 'Trip Dashboard Collection');
        //           }else{
        //             if(resp.Data.direct_dispatch=="1"){
        //             this.router.navigate(['/Dairy/trip_Dashboard']);
        //           }else{
        //           this.router.navigate(['/Dairy/ViewIndentS']);
        //           }
        //           }
        //           localStorage.setItem('path', '/Dairy/ViewIndentS');
        //           localStorage.setItem('Title', 'View Indent');
        //           localStorage.setItem('path3', '/Dairy/trip_Dashboard')
        //           localStorage.setItem('Title3', 'Trip Dashboard');
        //           localStorage.setItem('path2', '/Dairy/Inventory')
        //           localStorage.setItem('Title2', 'Inventory');
        //           localStorage.setItem('path4', '/Dairy/projection')
        //           localStorage.setItem('Title4', 'Projection');
        //           localStorage.setItem('pathhome', 'https://beta.secutrak.in/secutrak/?exttkn=' + acc!)
        //           localStorage.setItem('Titlehome', 'Home');
        //           localStorage.setItem('pathreport', '/Dairy/TripTanker')
        //           localStorage.setItem('Titlereport', 'Tanker Wise');
        //           localStorage.setItem('pathreport1', '/Dairy/TripIndent')
        //           localStorage.setItem('Titlereport1', 'Indent Wise');
        //           localStorage.setItem('pathreport2', '/Dairy/TripMPC')
        //           localStorage.setItem('Titlereport2', 'MPC Wise');
        //           localStorage.setItem('pathreport3', '/Dairy/Alert_report')
        //           localStorage.setItem('Titlereport3', 'Alert Report');
        //           localStorage.setItem('pathLoadpla', '/Dairy/loadPlanning')
        //           localStorage.setItem('TitleLoadpla', 'Load Planning');

        //         }
        //         else if (resp.Data.UserType === "Corporate Plant") {
        //           // this.router.navigate(['/Retail/summary']);
        //           this.router.navigate(['/Dairy/trip_Dashboard']);
        //           localStorage.setItem('path', '/Dairy/ViewIndentS');
        //           localStorage.setItem('Title', 'View Indent');
        //           // localStorage.setItem('path2','/Dairy/Inventory')
        //           // localStorage.setItem('Title2', 'Inventory');
        //           localStorage.setItem('path3', '/Dairy/trip_Dashboard')
        //           localStorage.setItem('Title3', 'Trip Dashboard');
        //           localStorage.setItem('pathhome', 'https://beta.secutrak.in/secutrak/?exttkn=' + acc)
        //           localStorage.setItem('Titlehome', 'Home');
        //           localStorage.setItem('pathreport', '/Dairy/TripTanker')
        //           localStorage.setItem('Titlereport', 'Tanker Wise');
        //           localStorage.setItem('pathreport1', '/Dairy/TripIndent')
        //           localStorage.setItem('Titlereport1', 'Indent Wise');
        //           localStorage.setItem('pathreport2', '/Dairy/TripMPC')
        //           localStorage.setItem('Titlereport2', 'MPC Wise');
        //           localStorage.setItem('pathreport3', '/Dairy/Alert_report')
        //           localStorage.setItem('Titlereport3', 'Alert Report');
        //           localStorage.setItem('pathdis', '/Dairy/dispatch_planning_report')
        //           localStorage.setItem('Titledis', 'Dispatch Planning');
        //           // localStorage.setItem('pathLECI','/Dairy/LECI_Dash')
        //           // localStorage.setItem('TitleLECI', 'LECI Dashboard');

        //         }
        //         else if (resp.Data.UserType === "CQA") {

        //           this.router.navigate(['/Dairy/trip_Dashboard']);

        //           localStorage.setItem('path3', '/Dairy/trip_Dashboard')
        //           localStorage.setItem('Title3', 'Trip Dashboard');

        //           localStorage.setItem('pathreport', '/Dairy/TripTanker')
        //           localStorage.setItem('Titlereport', 'Tanker Wise');

        //           localStorage.setItem('pathreport1', '/Dairy/TripIndent')
        //           localStorage.setItem('Titlereport1', 'Indent Wise');

        //           localStorage.setItem('pathreport2', '/Dairy/TripMPC')
        //           localStorage.setItem('Titlereport2', 'MPC Wise');
        //           localStorage.setItem('pathreport3', '/Dairy/Alert_report')
        //           localStorage.setItem('Titlereport3', 'Alert Report');

        //         }
        //         else if (resp.Data.UserType === "SVT") {

        //           this.router.navigate(['/Dairy/Travel_report']);
        //           localStorage.setItem('pathhome', 'https://beta.secutrak.in/secutrak/?exttkn=' + acc!)
        //           localStorage.setItem('Titlehome', 'Home');

        //           // localStorage.setItem('path3','/Dairy/trip_Dashboard')
        //           // localStorage.setItem('Title3', 'Trip Dashboard');

        //           // localStorage.setItem('pathreport','/Dairy/TripTanker')
        //           // localStorage.setItem('Titlereport', 'Tanker Wise');

        //           // localStorage.setItem('pathreport1','/Dairy/TripIndent')
        //           // localStorage.setItem('Titlereport1', 'Indent Wise');

        //           // localStorage.setItem('pathreport2','/Dairy/TripMPC')
        //           // localStorage.setItem('Titlereport2', 'MPC Wise');
        //           // localStorage.setItem('pathreport3','/Dairy/Alert_report')
        //           // localStorage.setItem('Titlereport3', 'Alert Report');

        //         }
        //         else if (resp.Data.UserType === "Corporate Admin") {
        //           this.router.navigate(['/Dairy/MakerCheker']);
        //           localStorage.setItem('pathadmin', '/Dairy/MakerCheker')
        //           localStorage.setItem('TitleForAdmin', 'Maker checker')
        //           localStorage.setItem('pathhome1', 'https://dairybeta.secutrak.in/home-vehicles')
        //           localStorage.setItem('Titlehome1', 'Home');
        //           // localStorage.setItem('pathreport','/Dairy/TripTanker')
        //           // localStorage.setItem('Titlereport', 'Tanker Wise');
        //           // localStorage.setItem('pathreport1','/Dairy/TripIndent')
        //           // localStorage.setItem('Titlereport1', 'Indent Wise');
        //           // localStorage.setItem('pathreport2','/Dairy/TripMPC')
        //           // localStorage.setItem('Titlereport2', 'MPC Wise');
        //         }
        //         else {
        //           this.router.navigate(['/Dairy/TripTanker']);
        //         }

        //         // if (resp.Data.UserName == "Paayas_test") {
        //         //   localStorage.setItem('pathnewhome', '/Dairy/Home')
        //         //   localStorage.setItem('Titlepathnewhome', 'New Home');
        //         // }

        //     if (resp.Data.icm == 1){
        //                localStorage.setItem('pathcartDash', '/Dairy/cartDash')
        //           localStorage.setItem('TitlecartDash', 'Cart Dashboard');
        //                localStorage.setItem('pathcartreport', '/Dairy/cart_report')
        //           localStorage.setItem('Titlecartreport', 'Cart Report');
        //                localStorage.setItem('pathcartreportEX', '/Dairy/cart_reportEX')
        //                localStorage.setItem('pathFRreport', '/Dairy/FRreport')
        //           localStorage.setItem('TitleFRreport', 'Frenchise Report');
        //     // Dashboard and Reports

        //     if(resp.Data.AccountType == 12 || resp.Data.AccountType == 6){
        //         // Manage Parts
        //            localStorage.setItem('pathadda', '/Dairy/Adda')
        //           localStorage.setItem('Titleadda', 'Adda');
        //            localStorage.setItem('pathfren', '/Dairy/frenchise')
        //           localStorage.setItem('Titlefren', 'Frenchise');
        //            localStorage.setItem('pathfrenmap', '/Dairy/frenchise_mapping')
        //           localStorage.setItem('Titlefrenmap', 'Frenchise Mapping');
        //            localStorage.setItem('pathcartmap', '/Dairy/cart_mapping')
        //           localStorage.setItem('Titlecartmap', 'Cart Mapping');
        //            localStorage.setItem('pathcarttimg', '/Dairy/cart_Time')
        //           localStorage.setItem('Titlecarttimg', 'Cart Timing');
        //     }

        // }

        //         if (resp.Data.UserType === "Regulatory Officer") {
        //           localStorage.setItem('pathbil', '/Billing/BillingReport')
        //           localStorage.setItem('Titlebil', 'Billing Report');
        //           localStorage.setItem('pathblck', '/Dairy/blacklist')
        //           localStorage.setItem('Titleblck', 'Blacklisted');

        //         }
        //         //  if(resp.Data.UserName==="Paayas_test"){
        //         //   localStorage.setItem('pathdis','/Dairy/dispatch_planning')
        //         //   localStorage.setItem('Titledis', 'Dispatch Planning');
        //         // }
        //         //  if(resp.Data.UserType==="Manager"){
        //         localStorage.setItem('pathElock', '/Billing/E-Lock')
        //         localStorage.setItem('TitleElock', 'E-lock Report');
        //         localStorage.setItem('pathwallet', '/Dairy/Doc_wallet')
        //         localStorage.setItem('Titlewallet', 'Document Wallet');
        //         // }

        //         if (resp.Data.UserType === "Corporate Plant" && resp.Data.MakerChecker === 'MAKER') {

        //           localStorage.setItem('pathLECI', '/Dairy/LECI_Dash')
        //           localStorage.setItem('TitleLECI', 'LECI Dashboard');
        //           localStorage.setItem('pathLECI_REport', '/Dairy/Leci_report')
        //           localStorage.setItem('TitleLECI_REport', 'LECI Report');

        //         }
        //         if (resp.Data.UserType === 'Manager') {
        //           localStorage.setItem('pathLECI', '/Dairy/LECI_Dash')
        //           localStorage.setItem('TitleLECI', 'LECI Dashboard');
        //           localStorage.setItem('pathLECI_REport', '/Dairy/Leci_report')
        //           localStorage.setItem('TitleLECI_REport', 'LECI Report');
        //           localStorage.setItem('pathsumm', '/Dairy/Summary_Dash')
        //           localStorage.setItem('Titlesumm', 'Summary Dashboard');
        //           //    localStorage.setItem('pathdis','/Dairy/dispatch_planning_report')
        //           // localStorage.setItem('Titledis', 'Dispatch Planning');
        //         }
        //         if (resp.Data.UserType === 'Corporate Master') {
        //           this.router.navigate(['/Dairy/mappinginfo']);
        //           localStorage.setItem('pathmccmapping', '/Dairy/mappinginfo')
        //           localStorage.setItem('Titlemccmapping', 'Mcc Mapping');
        //           localStorage.setItem('pathagreement', '/Dairy/AggrementInfo')
        //           localStorage.setItem('Titleagreement', 'Aggrement Info');
        //         }

        //         //  this.router.navigate(['/Dairy/Dispatch']);
        //         //  concatMap(() => from(this.router.navigateByUrl('/maps')))
        //         // this.router.navigateByUrl('/maps');
        //         // window.open('/maps/Live');
        //   } else {
        //       this.router.navigate(['/terms']);
        //     }
      }
    });
  }

  login() {
    // console.log(this.loginForm)

    // this.disabled = "btn-loading"
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.Password)) {
      this.authservice
        .loginWithEmail(this.email, this.Password)
        .then(() => {
          this.router.navigate(['/sales']);
          console.clear();
        })
        .catch((_error: any) => {
          this._error = _error;
          this.router.navigate(['/']);
        });
    }
  }

  validateForm(email: string, Password: string) {
    if (email.length === 0) {
      this.errorMessage = 'please enter email id';
      return false;
    }

    if (Password.length === 0) {
      this.errorMessage = 'please enter Password';
      return false;
    }

    if (Password.length < 6) {
      this.errorMessage = 'Password should be at least 6 char';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  //angular
  public loginForm!: FormGroup;
  public error: any = '';

  get form() {
    return this.loginForm.controls;
  }

  async Submit() {
    // debugger;
    try {
      const formData = new FormData();
      formData.append('UserId', this.loginForm.controls['UserId'].value);
      formData.append('Password', this.loginForm.controls['Password'].value);
      formData.append('GroupId', this.loginForm.controls['GroupId'].value);
      formData.append('Json', '1');
      const res: any = await firstValueFrom(this.authservice.login(formData));
      if (res.Status === 'success') {
        localStorage.setItem('AccessToken', res.Data.AccessToken);
        localStorage.setItem('GroupId', res.Data.GroupId);
        localStorage.setItem('AccountType', res.Data.AccountType);
        localStorage.setItem('UserName', res.Data.AccountName);
        localStorage.setItem('GroupType', res.Data.GroupType);
        localStorage.setItem('GroupTypeId', res.Data.GroupTypeId);
        localStorage.setItem('AccountId', res.Data.AccountId);
        localStorage.setItem('usertype', res.Data.UserType);
        localStorage.setItem('AccessMenu', JSON.stringify(res.AccessMenu));
        this.router.navigate(['/trip-dashboard']);
      }
    } catch (error) {}
  }

  toggleVisibility() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }
}
