import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompPtDataModel } from '../../_models/candCompPtDataModel.model';
import { RootFitmentService } from '../../_service/root-fitment.service';
import { ToastrService } from 'ngx-toastr';
import { XdComponent } from '../../../../shared/components/xd-container/xd-component';
import { ComponentState } from '../../../../shared/components/xd-container/xd-component-state';
import { IDropdownData, ILockInPDropdownData } from '../../_contracts/IDropdownData';
import { StorageService } from '../../../../core/storage/storage.service'
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import * as contracts from "../../_contracts"
import { APP_CONFIG } from '../../../../../app/app.config';
import { NgForm } from '@angular/forms';
import { DatePipe, getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-create-new-pt',
  templateUrl: './create-new-pt.component.html',
  styleUrls: ['./create-new-pt.component.scss']
})
export class CreateNewPtComponent extends XdComponent implements OnInit {

  @ViewChild('confFitmentForm') confFitmentForm: NgForm;
  CompPtData: CompPtDataModel = new CompPtDataModel();
  // @Input('dDataArray') dDataArray: Array<IDropdownData>;
  LockInPeriodArray: Array<ILockInPDropdownData> = [];

  minDate : Date = new Date((new Date()).setHours(0, 0, 0, 0)); //= new Date();

  firstPaymentMonthArray: Array<number> = [];

  ExecFitment: boolean = true;
  cndapprovalstatus: any;
  gridApprStatus: any;
  public columnApprStatus: any[];
  // showSearchGrid: boolean = false;
  candLevel: any;
  candId: string;
  configType: string;
  InternationalWorkerlist: string[] = ['Yes', 'No'];
  public columnDef: any[];
  selectMaxDate: Date = new Date();

  CID: any;
  UserID: any;
  strongPswd: any;
  PtFormSaveSubmitDataCompare: string;
  isAckwge: boolean = false;
  dialog: DialogRef;

  showReExpensePaidClnt: boolean = false;
  ngMoEligibleRelocExpYN:boolean;

  isJBApprover: any = "N";
  userName: any;
  isDataLoading: boolean = false;
  approversList: Array<contracts.IApproverList> = [];
  ngMoSelectedApprover: contracts.IApproverList[] = [];
  removedApprvr: contracts.IApproverList[] = [];
  ngMojoiningbonusEligibleYN: boolean = false; //c
  ngMolockInPeriodValue: any = null;
  ngMojoiningBonusYN: boolean;
  ngMojoiningBonus: any;
  ngMojoiningBonusComments: any; //c
  ngMonoticePeriodBuyoutYN: boolean = false; //c
  ngMonoticePeriodBuyoutPBCYN: boolean;
  ngMorelocationExpensesYN: boolean; //c
  ngMorelocationExpenses: any; //c
  ngMoFirstPaymentPlan: any = null;
  ngMoLastPaymentPlan: any = null;
  ngMojoiningBonusPaymentPlan: any = null;
  ngMorsuYN: boolean; //c
  ngMorsu: any; //c
  ngMonightShiftAllowanceYN: boolean; //c
  ngMotransitAccomodationReqYN: boolean; //c
  ngMoMinIpb: any;
  ngMoMaxIpb: any;
  ngMoMinGab: any;
  ngMoMaxGab: any;
  ngMocndResumeSubDate: any;

  confirmAction: Array<any> = [
    { text: 'OK', primary: false },
    { text: 'Cancel' }
  ];

  alertAction: Array<any> = [
    { text: 'OK', primary: true }
  ];

  isCreateNEwEnabled: boolean = false;
  isReExEnabled: boolean = false;
  // isRsuEnabled : boolean = false;
  isSendMailEnabled: boolean = false;
  saveBtnEnable: boolean = false;
  onChangeTemplate: boolean = true;
  templstJBApprovers: Array<contracts.IApproverList> = [];
  addedApprover: Array<contracts.IApproverList> = [];
  IsFormLoadDesabled: boolean = true;
  careerLevelPT: string;
  minJB: any;
  configData: any;
  PTemailPopupURL: any;
  ptDetailsCompleteResponse: any;
  /* showPaymentMonth: boolean = false; */
  /* disableJBcomments: boolean = true;
  disableJBPayPln: boolean = true; */
  showApprovalStatus: boolean = true;
  validationMsg: string[] = [];
  lblApprovalMsg: any = null;
  tempRelExpFrmMst: any = null;

  constructor(private route: ActivatedRoute, public datepipe: DatePipe,public rootFitmentService: RootFitmentService, private storageService: StorageService, public toastr: ToastrService, private dialogService: DialogService, private config: APP_CONFIG) {
    super();
    this.strongPswd = JSON.parse(this.storageService.fetchData("strongpassword"));
    this.UserID = JSON.parse(this.storageService.fetchData("userid"));
    this.configData = config.getConfig();
    this.PTemailPopupURL = this.configData.eso.PTemailPopupURL;
  }

  todayDate: Date = new Date((new Date()).setHours(0,0,0,0) ) ;

  public show: boolean = true;
  public systemShow: boolean = false;
  public JBShow: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.careerLevelPT = params.get('candidateMode');
      this.candId = params.get('Id');
      if (Number(this.careerLevelPT) <= 8) {
        this.configType = 'exec'
      }
      else {
        this.configType = 'lateral'
      }
    });
    this.createColDef_ApprStatus();
    this.loadPTDetails();
    
    // this.showSearchGrid = true;
    this.saveBtnEnable = true;

    for (let index = 1; index <= 24; index++) {
      this.firstPaymentMonthArray.push(index);
    }

  }

  restrictDate()
  {
    return false;
  }

  createColDef_ApprStatus() {
    this.columnApprStatus = [
      {
        title: "Recruiter Name",
        field: "recruitername",
        width: 150,
        hidden: false,
        route: true
      },
      {
        title: "Recruiter Email",
        field: "recruiteremail",
        width: 150,
        hidden: false
      },
      {
        title: "Delivery Spoc",
        field: "deliveryspocname",
        width: 150,
        hidden: false
      },
      {
        title: "Approvers Selected",
        field: "approver_selected",
        width: 150,
        hidden: false
      },
      {
        title: "Approver Name",
        field: "approvername",
        width: 150,
        hidden: false
      },
      {
        title: "Approver Role",
        field: "approvalrole",
        width: 150,
        hidden: false
      },
      {
        title: "Approval Status",
        field: "approvalstatus",
        width: 150,
        hidden: false
      },
      {
        title: "Approver Comments",
        field: "APPROVEREJECTIONREASON",
        width: 150,
        hidden: false
      },
      {
        title: "Eligible for Joining Bonus",
        field: "joiningbonusEligibleYN",
        width: 150,
        hidden: false
      }
      ,
      {
        title: "Joining Bonus Paid by Client",
        field: "joiningbonusclient",
        width: 150,
        hidden: false
      },
      {
        title: "Joining Bonus Payment Plan",
        field: "joiningBonusPaymentPlan",
        width: 150,
        hidden: false
      }

      ,
      {
        title: "Joining Bonus",
        field: "joiningbonus",
        width: 150,
        hidden: false
      }
      ,
      {
        title: "Lock-in Period(in months)",
        field: "lockin",
        width: 150,
        hidden: false
      },
      {
        title: "Joining Bonus Comments",
        field: "joiningbonuscomments",
        width: 150,
        hidden: false
      },
      {
        title: "Notice Period Buyout",
        field: "noticeperiodbuyout",
        width: 150,
        hidden: false
      },
      {
        title: "Notice Period Buyout paid by Client",
        field: "noticeperiodbuyoutclient",
        width: 150,
        hidden: false
      },
      {
        title: "Relocation Expense",
        field: "relexpense",
        width: 150,
        hidden: false
      },

      {
        title: "Relocation Expense paid by Client",
        field: "relexpenseclient",
        width: 150,
        hidden: false
      },
      {
        title: "RSU in USD",
        field: "RsuInUsd",
        width: 150,
        hidden: this.configType == 'exec' ? false : true
      },
      {
        title: "RSU paid by the client",
        field: "Rsu",
        width: 150,
        hidden: this.configType == 'exec' ? false : true
      },

      {
        title: "On Behalf Recruiter Name",
        field: "OnBehalfrecruiter",
        width: 150,
        hidden: false
      },
      {
        title: "On Behalf Recruiter Email",
        field: "OnBehalfRecruiterEmail",
        width: 150,
        hidden: false
      },

      {
        title: "Fitment Version No",
        field: "RCP_FITMENT_VERSION_ID",
        width: 150,
        hidden: false
      },

      {
        title: "PT Version No",
        field: "RCP_VERSION_ID",
        width: 150,
        hidden: false
      },
      {
        title: "Date",
        field: "approvaldate",
        width: 150,
        hidden: false
      }
    ]
  }

  loadPTDetails() {
    try {
      this.setState(ComponentState.loading);
      var RequestPayload: any;
      if (this.configType == 'exec') {
        RequestPayload =
          {
            "CID": this.candId ? this.candId.replace("C", "") : "",
            "UserID": this.UserID,
            "SPass": this.strongPswd
          }
      } else {
        RequestPayload =
          {
            "CID": this.candId,
            "UserID": this.UserID.toString(),
            "SPass": this.strongPswd
          }
      }

      console.log("PT Request payload " + JSON.stringify(RequestPayload));

      this.rootFitmentService.loadPTDetails(RequestPayload, this.configType)
        .subscribe(
          response => {
            if (response) {
              // console.log(response);
              this.ptDetailsCompleteResponse = response
              this.CompPtData = new CompPtDataModel(response);
              console.log("Model binded - CompPtData", this.CompPtData);

              this.LockInPeriodArray = this.CompPtData.lstLockinPeriod;
              this.ngMojoiningBonusComments = this.CompPtData.compensationDetails.joiningBonusComments;
              this.ngMolockInPeriodValue = this.CompPtData.compensationDetails.joiningBonusDuration ? this.CompPtData.compensationDetails.joiningBonusDuration : null;
              this.ngMojoiningbonusEligibleYN = this.CompPtData.compensationDetails.joiningbonusEligibleYN === 'Y' ? true : false;
              this.ngMojoiningBonusYN = this.CompPtData.compensationDetails.joiningBonusYN === 'Y' ? true : false;
              this.ngMonoticePeriodBuyoutYN = this.CompPtData.compensationDetails.noticePeriodBuyoutYN === 'Y' ? true : false
              this.ngMonoticePeriodBuyoutPBCYN = this.CompPtData.compensationDetails.noticePeriodBuyoutPBCYN === 'Y' ? true : false
              this.ngMojoiningBonus = this.CompPtData.compensationDetails.joiningBonus ? +this.CompPtData.compensationDetails.joiningBonus : null;
              this.ngMojoiningBonusPaymentPlan = this.CompPtData.compensationDetails.joiningBonusPaymentPlan;
              this.ngMoFirstPaymentPlan = this.CompPtData.compensationDetails.FirstPaymentPlan; // !! FirstPaymentPlan - valid only for Exec case !!
              this.ngMoLastPaymentPlan = this.CompPtData.compensationDetails.LastPaymentPlan;   // !! LastPaymentPlan - valid only for Exec case !!
              this.ngMorsuYN = this.CompPtData.compensationDetails.rsuYN === 'Y' ? true : false
              this.ngMorsu = this.CompPtData.compensationDetails.rsu;

              this.ngMoEligibleRelocExpYN = this.CompPtData.compensationDetails.EligibleRelocExpYN === 'Y' ? true : false
              this.ngMorelocationExpensesYN = this.CompPtData.compensationDetails.relocationExpensesYN === 'Y' ? true : false

              this.ngMonightShiftAllowanceYN = this.CompPtData.compensationDetails.nightShiftAllowanceYN === 'Y' ? true : false
              this.ngMotransitAccomodationReqYN = this.CompPtData.compensationDetails.transitAccomodationReqYN === 'Y' ? true : false

              this.onChangeReXPaidClnt();

              if (this.CompPtData.cndapprovalstatus.length != 0) {
                this.showApprovalStatus = true;
              } else {
                this.showApprovalStatus = false;
              }

              if (this.CompPtData.versionDetails.PTstatus == 'PT Undefined' || this.CompPtData.versionDetails.PTstatus == 'Draft') {
                this.IsFormLoadDesabled = false;
                this.isCreateNEwEnabled = true;
                this.saveBtnEnable = false;
                // this.showApprovalStatus = false;
              }

              if (this.CompPtData.versionDetails.PTstatus == 'JB Approval Pending') {
                this.IsFormLoadDesabled = true;
                this.isCreateNEwEnabled = false;
                this.saveBtnEnable = true;
                // this.showApprovalStatus = true;
              }

              if (this.CompPtData.versionDetails.PTstatus == 'Cancelled') {
                this.isCreateNEwEnabled = true;
              }

              if (this.CompPtData.versionDetails.PTstatus == 'Approved') {
                // this.showApprovalStatus = true;
                this.IsFormLoadDesabled = true;
                this.saveBtnEnable = true;
                this.isCreateNEwEnabled = false;
                this.isSendMailEnabled = false;
              }

              if (this.CompPtData.versionDetails.cIdVersionId > 0 && this.CompPtData.versionDetails.compType == "POSITIONINGTEMPLATE" || this.CompPtData.versionDetails.PTstatus == "Approved") {
                this.isSendMailEnabled = false; //Send to Mail button shud b Enabled
              } else {
                this.isSendMailEnabled = true; //Send to Mail button shud b disabled
              }

              let JB = this.CompPtData.compensationDetails.joiningBonus;
              let JBDuration = +this.CompPtData.compensationDetails.joiningBonusDuration;
              if (JB && JBDuration) {
                this.ngMojoiningBonus = +JB;
                this.minJB = this.LockInPeriodArray.filter((x) => x.lockInPeriodValue === JBDuration)[0].minJoiningBonus;
              }

              if (this.CompPtData.versionDetails.PTstatus != 'Approved' && this.CompPtData.versionDetails.PTstatus != 'Rejected' && this.CompPtData.versionDetails.PTstatus != 'Cancelled') {
                if (this.ngMojoiningBonus && this.minJB) {
                  this.toggle();
                }
              }
              this.populateValidationMsg();

              if (this.CompPtData.cid != null) {
                this.setState(ComponentState.ready);
              }
              else {
                this.setState(ComponentState.empty);
              }
            } else {
              this.setState(ComponentState.ready);
              if (response.message) {
                this.toastr.error(response.message);
              }
            }
          },
          error => {
            this.toastr.error("Server Error Occured");
            this.setState(ComponentState.empty);
          }, () => {
            // this.AngGetJBApproverList();
          }
        )
    } catch (err) {
      console.error("ERROR!!! ", err);
      this.setState(ComponentState.empty);
      this.toastr.error("Something went wrong at Client end");
    }
  }

  populateValidationMsg() {
    this.validationMsg=[];

    /* if (this.CompPtData.IsEAFAvailable === false) {
      this.toastr.warning("Note: Employee Application Form (EAF) for the Candidate is not available.");
    } */

    if (this.CompPtData.fakeRestrictOrg) {
      this.validationMsg.push(this.CompPtData.fakeRestrictOrg)
    }

    if (this.CompPtData.lblCancelledMsg) {
      this.validationMsg.push(this.CompPtData.lblCancelledMsg)
    }

    if (this.CompPtData.dupValidation) {
      this.validationMsg.push(this.CompPtData.dupValidation)
    }

    if (this.CompPtData.PTValidationAlert.length > 0) {
      this.CompPtData.PTValidationAlert.forEach(element => {
        this.toastr.warning(element); 
      });
    }
  }

  toggle() {
    if (this.ngMojoiningBonus > this.minJB) {
      this.JBShow = true;
      this.systemShow = false;
      this.lblApprovalMsg = 'JB Approval Required';
      this.AngGetJBApproverList();
    } else if ((this.ngMojoiningBonus === this.minJB) && ((this.careerLevelPT === '12' && this.ngMolockInPeriodValue === '18') || (this.careerLevelPT === '13' && this.ngMolockInPeriodValue === '15'))) {
      this.JBShow = true;
      this.systemShow = false;
      this.lblApprovalMsg = 'JB Approval Required';
      this.AngGetJBApproverList();
    } else if (this.ngMojoiningBonus === this.minJB) {
      this.systemShow = true;
      this.JBShow = false;
      this.lblApprovalMsg = 'System Approved';
    } else { // !! else block will execute when (this.ngMojoiningBonus < this.minJB) !!
      this.lblApprovalMsg = '';
      this.systemShow = false;
      this.JBShow = false;
    }
  }

  onAutoCompleteChange(filter: string) {
    try {
      if (filter && filter.trim().length > 2) {
        this.isDataLoading = true;

        /* this.approversList = this.CompPtData.lstJBApprovers.filter((data: contracts.IApproverList) => {
          return (data.App_Name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        }); */
        this.approversList = this.templstJBApprovers.filter((data: contracts.IApproverList) => {
          return (data.App_Name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
        });
        this.isDataLoading = false;
      }
      else {
        //search string is less than 3, so clear the list
        this.approversList = [];
      }

    } catch (err) {
      // console.error("Error ", err);
      this.toastr.error("Something went wrong at client end");
      this.isDataLoading = false;
    }
  }

  onValueSelection(event: any) {
    try {
      if (event) {
        this.ngMoSelectedApprover = [];
        var temp_IApproverList: custom_apprvrList;
        temp_IApproverList = new custom_apprvrList();
        temp_IApproverList.App_ID = event.App_ID;
        temp_IApproverList.App_Name = event.App_Name;
        temp_IApproverList.RAR_ID = event.RAR_ID;

        this.ngMoSelectedApprover.push(temp_IApproverList);
      }
      else {
        this.ngMoSelectedApprover = undefined;
      }

    } catch (err) {
      console.error("Error ", err);
      this.toastr.error("Something went wrong at client end");
    }
  }

  assignApprover() {
    try {
      if (this.ngMoSelectedApprover && this.ngMoSelectedApprover.length > 0) {
        var index_checkDuplicate = this.addedApprover.findIndex((x) => x.App_Name === this.ngMoSelectedApprover[0]['App_Name']);

        if (index_checkDuplicate === -1) { // Returns -1, if no duplicates. Hence, execute below block
          this.addedApprover.push(this.ngMoSelectedApprover[0]);
          this.approversList = [];
          this.checkandTrimDuplicates();
        }
        else {
          this.toastr.warning("Cannot assign duplicate approver");
        }
      }
      else {
        this.toastr.warning("Select an approver first from the list, before assigning");
      }
    } catch (err) {
      console.error("ERROR!!! ", err);
      this.toastr.error("Something went wrong at client end");
    }
  }

  checkandTrimDuplicates() {
    var index_checkDuplicate = this.removedApprvr.findIndex((x) => x.App_Name === this.ngMoSelectedApprover[0]['App_Name']);
    if (index_checkDuplicate !== -1) { //If Match found flush out the duplicate record.
      this.removedApprvr.splice(index_checkDuplicate, 1);
    }
  }

  removeApprover(apprvName: any): void {
    try {

      let removeApprvr = this.addedApprover.findIndex((x: any) => x.App_Name == apprvName.App_Name);
      this.addedApprover.splice(removeApprvr, 1);

      var temp_removedApprvr: custom_apprvrList;
      temp_removedApprvr = new custom_apprvrList();
      temp_removedApprvr.App_ID = apprvName.App_ID;
      temp_removedApprvr.App_Name = apprvName.App_Name;
      temp_removedApprvr.RAR_ID = apprvName.RAR_ID;

      this.removedApprvr.push(temp_removedApprvr);

    } catch (err) {
      console.error("ERROR!!! ", err);
      this.toastr.error("Something went wrong at client end");
    }
  }

  AngGetJBApproverList() {
    try {
      let RequestPayload =
      {
        "CID": this.candId, //? this.candId.replace("C", "") : "",
        "JoiningBonus": this.ngMojoiningBonus //CompPtData.compensationDetails.joiningBonus
      }
      // this.setState(ComponentState.loading);
      console.log("PT JB Request payload " + JSON.stringify(RequestPayload));

      this.rootFitmentService.AngGetJBApproverList(RequestPayload)
        .subscribe(
          response => {
            if (response && response.lstJBApprovers) { //response.lstJBApprovers

              this.templstJBApprovers = response.lstJBApprovers;
              console.log("JBApproval CompPtData", this.templstJBApprovers);

              if (this.CompPtData.cid != null) {
                // this.setState(ComponentState.ready);
              }
              else {
                // this.setState(ComponentState.empty);
              }
            } /* else {
                this.setState(ComponentState.ready);
                if (response.message) {
                  this.toastr.error(response.message);
                }
              } */
          },
          error => {
            this.toastr.error("Server Error Occured");
            // this.setState(ComponentState.empty);
          }
        )
    } catch (err) {
      console.error("ERROR!!! ", err);
      this.toastr.error("Something went wrong at Client end");
      this.setState(ComponentState.ready);
    }
  }

  OpenDialog(title: string, content: string, action: Array<any>): DialogRef {
    return this.dialogService.open({
      title: title,
      content: content,
      actions: action,
      width: 420,
      height: 150,
      minWidth: 250
    });
  }

  onChangeReXPaidClnt() {
    if (this.ngMoEligibleRelocExpYN == true) {
      if (this.tempRelExpFrmMst) { // !! 'RelExpFrmMst' - Carries fresh Relocation amount, from Relocation Master (if in case updated by user) !!
        this.ngMorelocationExpenses = +this.tempRelExpFrmMst;
      } else {
        this.ngMorelocationExpenses = this.CompPtData.compensationDetails.relocationExpenses ? +this.CompPtData.compensationDetails.relocationExpenses : null;
      }
      if (this.ngMoEligibleRelocExpYN == true && this.ngMorelocationExpenses) {
        this.showReExpensePaidClnt = true;
      }
    } 
    else {
      this.ngMorelocationExpenses = null;
      this.showReExpensePaidClnt = false;
    }
  }

  resetRsuField() {
    this.ngMorsu = null;
  }

  restrictAlphabate(e: any) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58)
      || e.keyCode == 8 || e.keyCode == 190)) {
      return false;
    }
    else {
      return true;
    }
  }

  twoDigitDecimel(event:any, element:any) {
    let regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
    let current: string = element.value;
    const position = this.CompPtData.compensationDetails.rsu;
    const next: string = [current.slice(), event.key == 'Decimal' ? '.' : event.key, current.slice(0 , position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  onCheckboxEJB(event: any) {
    if (event) { // if (event.currentTarget.checked === true) {
      if (this.LockInPeriodArray.length === 1) { // !!  When lock in period drop down value contains only one Value then it should be auto populated when Eligible for Joining Bonus Checkbox is Checked !!
        this.ngMolockInPeriodValue = this.CompPtData.compensationDetails.joiningBonusDuration ? this.CompPtData.compensationDetails.joiningBonusDuration : this.LockInPeriodArray[0].lockInPeriodValue;
        /* this.disableJBcomments = false;
        this.disableJBPayPln = false; */
        this.onChangeLckInPeriod(1); // !! passed '1' as an argument, coz it'll satisfy "this.LockInPeriodArray[index - 1].minJoiningBonus" to fetch the 1st array element  !!
      } else {
        this.ngMolockInPeriodValue = this.CompPtData.compensationDetails.joiningBonusDuration ? this.CompPtData.compensationDetails.joiningBonusDuration : null;
        /* if (this.ngMolockInPeriodValue) {
          this.disableJBcomments = false;
          this.disableJBPayPln = false;
        } */
      }

      this.ngMojoiningBonusYN = true;
    } else {
      this.ngMolockInPeriodValue = null; 
      this.ngMoFirstPaymentPlan = null;
      this.ngMoLastPaymentPlan = null;
      this.ngMojoiningBonus = null; //'';
      this.ngMojoiningBonusYN = false;
      this.ngMojoiningBonusPaymentPlan = null;
      this.ngMojoiningBonusComments = null;
      /* this.showPaymentMonth = false; */
      this.systemShow = false;
      this.JBShow = false;
      this.addedApprover = [];
      this.minJB = null;
    }
  }

  onChangeLckInPeriod(index: any) {
    // let index = value.currentTarget.selectedIndex
    // if (index !== 0) {
    if (index) {
      this.minJB = this.LockInPeriodArray[index - 1].minJoiningBonus;//this.LockInPeriodArray.filter((x) => x.lockInPeriodValue === +value)[0].minJoiningBonus; 
      this.toastr.warning("Joining bonus should be greater than or equal to " + this.minJB);
      /* this.disableJBcomments = false;
      this.disableJBPayPln = false; */
    } /* else {
      this.disableJBcomments = true;
      this.disableJBPayPln = true;
    } */
    this.ngMojoiningBonusPaymentPlan = null;
    /* this.showPaymentMonth = false; */
    this.ngMoFirstPaymentPlan = null;
    this.ngMoLastPaymentPlan = null;
  }

  onChangeJBPayPlan(value: any){
    this.ngMoFirstPaymentPlan = null;
    this.ngMoLastPaymentPlan = null;
    /* if(this.configType=='exec' && this.ngMojoiningBonusPaymentPlan === "Partial Payout"){
      this.showPaymentMonth = true;
    } else {
      this.showPaymentMonth = false; */
      if (this.configType=='lateral' && this.ngMojoiningBonusPaymentPlan === "Partial Payout") {
        var firstJBM = this.LockInPeriodArray.filter((x) => x.lockInPeriodValue === +this.ngMolockInPeriodValue)[0].firstJBM;
        var lastJBM = this.LockInPeriodArray.filter((x) => x.lockInPeriodValue === +this.ngMolockInPeriodValue)[0].lastJBM;

        this.toastr.info("Joining Bonus Payment will be made in two parts along with the salary of month " + firstJBM + " and month " + lastJBM);
      }
    /* } */
  }

  onCheckboxnpPBCYN(event: any) {
    if (event) { 
      this.ngMonoticePeriodBuyoutPBCYN = true;
    }else{
      this.ngMonoticePeriodBuyoutPBCYN = false;
    }
  }

  onChangeLastPayMnth() {
    if (this.ngMoFirstPaymentPlan && this.ngMoLastPaymentPlan){
    this.toastr.info("Joining Bonus Payment will be made in two parts along with the salary of month " + this.ngMoFirstPaymentPlan + " and month " + this.ngMoLastPaymentPlan);
    }
  }

  sendEmailToCandidate() {
    window.open(this.PTemailPopupURL + this.candId.slice(1)); //https://indaorm.ciostage.accenture.com/OLPOCPopup.aspx?Candid=3371157
  }

  onCreateNew() {
    this.isCreateNEwEnabled = true;
    this.isSendMailEnabled = true;
    this.saveBtnEnable = false;
    this.IsFormLoadDesabled = false;

    this.ptDetailsCompleteResponse.IsPTNewVersion = true; // added by sushma as per disscussion with deepak
    this.CompPtData.versionDetails.PTstatus = 'PT Undefined'
    this.CompPtData.versionDetails.PTVersion = this.CompPtData.versionDetails.PTVersion+1;
    this.CompPtData.versionDetails.PTstaid=1;

    /* if(this.ngMolockInPeriodValue){
    this.disableJBcomments = false;
    this.disableJBPayPln = false;} */

    if (this.CompPtData.IsEAFAvailable === false) {
      this.toastr.warning("Note: Employment Application Form (EAF) for the Candidate is not available.");
    }
    
    if(this.CompPtData.RelExpFrmMst){ // !! 'RelExpFrmMst' - Carries fresh Relocation amount, from Relocation Master (if in case updated by user) !!
      this.tempRelExpFrmMst = this.CompPtData.RelExpFrmMst;
      this.onChangeReXPaidClnt(); // !! invoking onChangeReXPaidClnt() coz if 'Eligible for Relocation Expense' is true we need to pre-populate 'Relocation Expense' with fresh value of 'RelExpFrmMst'. !!
    }
  }

  SaveorSbmitPT(type: any) {
    if (type == 'Save') {
      this.saveSbmitPTAPI(type)
    }
    else {
      if (this.confFitmentForm.valid) {
        if (this.ValidationChecksForSave()) {
          this.saveSbmitPTAPI(type);
        }
      }
      else if (this.CompPtData.cndDOJ < this.minDate && this.CompPtData.cndDOJ != null && (this.ngMojoiningbonusEligibleYN === false || this.ngMojoiningbonusEligibleYN === true) ) {
        this.toastr.warning("In-sufficient Candidate details provided")
      }
      else if (this.ngMojoiningbonusEligibleYN === true &&  (this.ngMojoiningBonusYN === false || this.ngMolockInPeriodValue == null || this.ngMojoiningBonus == "" || this.ngMojoiningBonusPaymentPlan == null || this.ngMojoiningBonusComments == "") ) {
        this.toastr.warning("In-sufficient Other Business Allowances details provided")
      }
    }
  }

  ValidationChecksForSave() {

    if (this.CompPtData.cndSR == null || this.CompPtData.cndSR == '') {
      this.toastr.warning("Please Tag SR to the candidate before submitting Position template")
      return false;
    }
    else if (this.CompPtData.recruiter == '') {
      this.toastr.warning("Please tag a Recruiter to the SR before submitting the Position Template for this candidate.")
      return false;
    }
    else if ((this.ngMojoiningbonusEligibleYN == true && this.JBShow == true) && (this.CompPtData.deliverySPOCId == 0 || this.CompPtData.deliverySPOCId == '' || this.CompPtData.deliverySPOCId == null)) {
      this.toastr.warning("Delivery SPOC should be tagged to the SR to submit a Position with Business Allowances")
      return false;
    }
    else if ((this.ngMojoiningBonusYN == true || this.ngMonoticePeriodBuyoutYN == true || this.ngMonoticePeriodBuyoutPBCYN == true || this.ngMojoiningBonus > 0 || this.ngMorelocationExpenses > 0) &&
      (this.CompPtData.deliverySPOCId == 0 || this.CompPtData.deliverySPOCId == '' || this.CompPtData.deliverySPOCId == null)) {
      this.toastr.warning("Delivery SPOC should be tagged to the SR to submit a Position with Business Allowances")
      return false;
    }
    else if (this.ngMojoiningBonus < this.minJB) {
      this.toastr.warning("Joining bonus should be greater than or equal to " + this.minJB);
      return false;
    }

    else {
      return true;
    }
  }


  saveSbmitPTAPI(type: any) {

    var appIDList: any[] = [];
    var appNameList: any[] = [];
    var RoleIdList:any[]=[];

    this.addedApprover.forEach((data: any) => {
      appIDList.push(data.App_ID);
      appNameList.push(data.App_Name);
      RoleIdList.push(data.RAR_ID)
    })

    if(this.configType=='exec')
    {
      try {
        var reqPayloadExec =
          {
            "cid": this.candId ? Number(this.candId.replace("C", "")) : "",
            "IsPTNewVersion": this.ptDetailsCompleteResponse.IsPTNewVersion, //true,
            "UserID": this.UserID,
            "cndSublevelId": this.ptDetailsCompleteResponse.cndSublevelId,
            "JBApproversSelected": appIDList,
            "ApproverRoleId": RoleIdList,
            "cndDOJ": this.datepipe.transform(this.CompPtData.cndDOJ, 'MM/dd/yyyy'), //this.CompPtData.cndDOJ,
            "SPass": this.strongPswd,
            "saveSubmit": type,
            "compensationDetails": this.CompPtData.compensationDetails,
            "deliverySPOCId": this.CompPtData.deliverySPOCId,
            "recruiterid": this.CompPtData.recruiterid,
            "cndLevelId": this.CompPtData.cndLevelId,

            "versionDetails": {
              "PTstaid": this.CompPtData.versionDetails.PTstaid,
              "cndstatusid": this.CompPtData.versionDetails.cndstatusid,
              "PTVersion": this.CompPtData.versionDetails.PTVersion,
              "compType": this.CompPtData.versionDetails.compType.toString(),
              "FitmentVersion": this.CompPtData.versionDetails.FitmentVersion
            }
          }
        /* reqPayloadExec.compensationDetails.relocationExpensesYN = 'N' */ //Commented by Zee
        reqPayloadExec.compensationDetails.joiningBonus = this.ngMojoiningBonus ? this.ngMojoiningBonus.toString() : '';
        reqPayloadExec.compensationDetails.joiningBonusPaymentPlan = this.ngMojoiningBonusPaymentPlan ? this.ngMojoiningBonusPaymentPlan : '';
        reqPayloadExec.compensationDetails.relocationExpenses = this.ngMorelocationExpenses ? this.ngMorelocationExpenses.toString() : '';
        reqPayloadExec.compensationDetails.joiningBonusDuration = this.ngMolockInPeriodValue ? this.ngMolockInPeriodValue : 0; 
        reqPayloadExec.compensationDetails.joiningBonusComments = this.ngMojoiningBonusComments == undefined ? '' : this.ngMojoiningBonusComments;
        // (this.ngMorsuYN == true || this.ngMorsuYN != undefined) ? (reqPayloadExec.compensationDetails.rsuYN = 'Y') : (reqPayloadExec.compensationDetails.rsuYN = 'N')
        this.ngMorsuYN == true  ? (reqPayloadExec.compensationDetails.rsuYN = 'Y') : (reqPayloadExec.compensationDetails.rsuYN = 'N')
        reqPayloadExec.compensationDetails.rsu = this.ngMorsu ? this.ngMorsu.toString() : '';
        this.ngMonoticePeriodBuyoutYN == true ? (reqPayloadExec.compensationDetails.noticePeriodBuyoutYN = 'Y') : (reqPayloadExec.compensationDetails.noticePeriodBuyoutYN = 'N')
        this.ngMorelocationExpensesYN == true ? (reqPayloadExec.compensationDetails.relocationExpensesYN = 'Y') : (reqPayloadExec.compensationDetails.relocationExpensesYN = 'N')
        this.ngMoEligibleRelocExpYN == true ? (reqPayloadExec.compensationDetails.EligibleRelocExpYN = 'Y') : (reqPayloadExec.compensationDetails.EligibleRelocExpYN = 'N')
        this.ngMojoiningBonusYN == true ? (reqPayloadExec.compensationDetails.joiningBonusYN = 'Y') : (reqPayloadExec.compensationDetails.joiningBonusYN = 'N')
        this.ngMojoiningbonusEligibleYN == true ? (reqPayloadExec.compensationDetails.joiningbonusEligibleYN = 'Y') : (reqPayloadExec.compensationDetails.joiningbonusEligibleYN = 'N')
        this.ngMonightShiftAllowanceYN == true ? (reqPayloadExec.compensationDetails.nightShiftAllowanceYN = 'Y') : (reqPayloadExec.compensationDetails.nightShiftAllowanceYN = 'N')
        this.ngMotransitAccomodationReqYN == true ? (reqPayloadExec.compensationDetails.transitAccomodationReqYN = 'Y') : (reqPayloadExec.compensationDetails.transitAccomodationReqYN = 'N')
        // this.ngMonightShiftAllowanceYN == true ? (reqPayloadExec.compensationDetails.nightShiftYN = 'Y') : (reqPayloadExec.compensationDetails.nightShiftYN = 'N')
        this.ngMonoticePeriodBuyoutPBCYN == true ? (reqPayloadExec.compensationDetails.noticePeriodBuyoutPBCYN = 'Y') : (reqPayloadExec.compensationDetails.noticePeriodBuyoutPBCYN = 'N')
        reqPayloadExec.compensationDetails.lblApprovalMessage  = this.lblApprovalMsg ? this.lblApprovalMsg : '';
        reqPayloadExec.compensationDetails.FirstPaymentPlan  = this.ngMoFirstPaymentPlan ? this.ngMoFirstPaymentPlan : '';
        reqPayloadExec.compensationDetails.LastPaymentPlan  = this.ngMoLastPaymentPlan ? this.ngMoLastPaymentPlan : '';

        var execSaveResponse: any
        this.rootFitmentService.AngPTSave(reqPayloadExec, this.configType).subscribe(apiData => {
          execSaveResponse = apiData;
        }, (error: any) => {
          this.toastr.error("Server Error Occured"); //error("error")
        }, () => {
          if (execSaveResponse) {
            
            var splitsexecSaveResponse =execSaveResponse.split(".");
            this.toastr.success(splitsexecSaveResponse[0]+"."); 
            if(splitsexecSaveResponse.length>1)
            this.toastr.warning(splitsexecSaveResponse[1]+"."); 
            // this.toastr.success('Success')
            this.loadPTDetails();
          }
          else {
            this.toastr.error('Server Error Occured'); //error('Some Error Occured')
          }
        })
      } catch (err) {
        console.error("ERROR!!! ", err);
        this.toastr.error("Something went wrong at Client end");
      }
    }
    else {
      try {
        this.CompPtData.compensationDetails.autoapproved = 'Y'
        var reqPayloadLat =
          {
            "cid": this.candId,
            "IsPTNewVersion": this.ptDetailsCompleteResponse.IsPTNewVersion,
            "UserID": this.UserID, //206114,
            "cndSublevelId": this.ptDetailsCompleteResponse.cndSublevelId.toString(),
            "ApproverUserID": appIDList.join().concat(","),
            "ApproverRoleId": RoleIdList.join().concat(","),
            //"cndDoj" : getLocaleDateFormat()
            "cndDOJ": this.datepipe.transform(this.CompPtData.cndDOJ, 'MM/dd/yyyy'),
            "SPass": this.strongPswd, //'ATSLJPMFWIJBfbAgfqkjEQ==', 
            "saveSubmit": type,
            "compensationDetails": this.CompPtData.compensationDetails,
            "deliverySPOCId": this.CompPtData.deliverySPOCId,
            "cndLevelId": this.CompPtData.cndLevelId,

            "versionDetails": {
              "PTstaid": this.CompPtData.versionDetails.PTstaid.toString(),
              "cndstatusid": this.CompPtData.versionDetails.cndstatusid.toString(),
              "PTVersion": this.CompPtData.versionDetails.PTVersion.toString(),
              "compType": this.CompPtData.versionDetails.compType.toString(),
              "FitmentVersion": this.CompPtData.versionDetails.FitmentVersion.toString()
            }
          }

        /* reqPayloadLat.compensationDetails.relocationExpensesPBCYN = 'N' */ // Commented by Zee
        reqPayloadLat.compensationDetails.joiningBonus = this.ngMojoiningBonus ? this.ngMojoiningBonus.toString() : '';
        reqPayloadLat.compensationDetails.joiningBonusPaymentPlan = this.ngMojoiningBonusPaymentPlan ? this.ngMojoiningBonusPaymentPlan : '';
        reqPayloadLat.compensationDetails.relocationExpenses = this.ngMorelocationExpenses ? this.ngMorelocationExpenses : '';
        reqPayloadLat.compensationDetails.joiningBonusDuration = this.ngMolockInPeriodValue ? this.ngMolockInPeriodValue : 0; 
        reqPayloadLat.compensationDetails.joiningBonusComments = this.ngMojoiningBonusComments == undefined ? '' : this.ngMojoiningBonusComments;
        // (this.ngMorsuYN == true || this.ngMorsuYN != undefined) ? (reqPayloadLat.compensationDetails.rsuYN = 'Y') : (reqPayloadLat.compensationDetails.rsuYN = 'N')
        this.ngMonoticePeriodBuyoutYN == true ? (reqPayloadLat.compensationDetails.noticePeriodBuyoutYN = 'Y') : (reqPayloadLat.compensationDetails.noticePeriodBuyoutYN = 'N')
        this.ngMorelocationExpensesYN == true ? (reqPayloadLat.compensationDetails.relocationExpensesYN = 'Y') : (reqPayloadLat.compensationDetails.relocationExpensesYN = 'N')
        this.ngMoEligibleRelocExpYN == true ? (reqPayloadLat.compensationDetails.EligibleRelocExpYN = 'Y') : (reqPayloadLat.compensationDetails.EligibleRelocExpYN = 'N')
        this.ngMojoiningBonusYN == true ? (reqPayloadLat.compensationDetails.joiningBonusYN = 'Y') : (reqPayloadLat.compensationDetails.joiningBonusYN = 'N')
        this.ngMojoiningbonusEligibleYN == true ? (reqPayloadLat.compensationDetails.joiningbonusEligibleYN = 'Y') : (reqPayloadLat.compensationDetails.joiningbonusEligibleYN = 'N')
        this.ngMonightShiftAllowanceYN == true ? (reqPayloadLat.compensationDetails.nightShiftAllowanceYN = 'Y') : (reqPayloadLat.compensationDetails.nightShiftAllowanceYN = 'N')
        this.ngMotransitAccomodationReqYN == true ? (reqPayloadLat.compensationDetails.transitAccomodationReqYN = 'Y') : (reqPayloadLat.compensationDetails.transitAccomodationReqYN = 'N')
        // this.ngMonightShiftAllowanceYN == true ? (reqPayloadLat.compensationDetails.nightShiftYN = 'Y') : (reqPayloadLat.compensationDetails.nightShiftYN = 'N')
        this.ngMonoticePeriodBuyoutPBCYN == true ? (reqPayloadLat.compensationDetails.noticePeriodBuyoutPBCYN = 'Y') : (reqPayloadLat.compensationDetails.noticePeriodBuyoutPBCYN = 'N')
        reqPayloadLat.compensationDetails.lblApprovalMessage  = this.lblApprovalMsg ? this.lblApprovalMsg : '';

        var latSaveResponse: any
        this.rootFitmentService.AngPTSave(reqPayloadLat, this.configType).subscribe(apiData => {
          latSaveResponse = apiData;
        }, (error: any) => {
          this.toastr.error("Server Error Occured"); //error("error")
        }, () => {
          if (latSaveResponse) {
            var splitslatSaveResponse=latSaveResponse.split(".");
            this.toastr.success(splitslatSaveResponse[0]+"."); 
            if(splitslatSaveResponse.length>1){
            this.toastr.warning(splitslatSaveResponse[1]+"."); } // this.toastr.success('Success')
            this.loadPTDetails();
          }
          else {
            this.toastr.error('Server Error Occured'); //error('Some Error Occured')
          }
        })
      } catch (err) {
        console.error("ERROR!!! ", err);
        this.toastr.error("Something went wrong at Client end");
      }
    }
  }

}

//UserDefined Custom Datatype
export class custom_apprvrList {
  App_ID: any;
  App_Name: any;
  RAR_ID: any;
}
