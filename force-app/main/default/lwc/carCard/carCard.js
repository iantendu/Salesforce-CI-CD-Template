import { LightningElement, wire } from 'lwc';
/**Car__c Schema */
import NAME_FIELD from '@salesforce/schema/Car__c.Name';
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_TYPE from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEAT_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';
import CAR_OBJECT from '@salesforce/schema/Car__c';

//Navigation
import { NavigationMixin } from 'lightning/navigation';

//Lightning Message Service and message channel
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';
import { subscribe, MessageContext,unsubscribe } from 'lightning/messageService';

//this function is used to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';
export default class CarCard extends NavigationMixin(LightningElement) {

  //Load MessageContext for LMS
  @wire(MessageContext)
  messageContext

    //Exposing field to make them available to the template

    categoryField= CATEGORY_FIELD;
    makeField= MAKE_FIELD;
    msrpField = MSRP_FIELD;
    fuelField = FUEL_TYPE;
    seatField = SEAT_FIELD;
    controlField = CONTROL_FIELD;

    //Id car to display data

    recordId;
    
    //Car fields displayed with specific format
    carName
    carPictureUrl

    //subscription reference for  carSelected
    carSelectionSubscription

  

    // handleRecordLoaded(event){
    //   const {records} = event.detail;
    //   const recordData= records[this.recordId];
    //   this.carName=getFieldValue(recordData,NAME_FIELD);
    //   this.carPictureUrl=getFieldValue(recordData,PICTURE_URL_FIELD);    
      
    // }

    handleRecordLoaded(event){
      const {records} =event.detail;
      const recordData=records[this.recordId];
      this.carName=getFieldValue(recordData,NAME_FIELD);
      this.carPictureUrl=getFieldValue(recordData,PICTURE_URL_FIELD);
    }

    connectedCallback(){
      this.subscribeHandler();
    }
  

    subscribeHandler(){
      this.carSelectionSubscription=subscribe(this.messageContext,CARS_SELECTED_MESSAGE,(message)=>this.handleCarSelected(message));
    }

    handleCarSelected(message){
      console.log('Car Id on this side ',message.carId);
      this.recordId=message.carId;
    }

    disconnectedCallback(){
      unsubscribe(this.carSelectionSubscription);
      this.carSelectionSubscription=null;
    }

    /**navigate to record page */
    handleNavigateToRecord(){
      this[NavigationMixin.Navigate]({
        type:'standard__recordPage',
        attributes:{
          recordId:this.recordId,
          objectApiName:CAR_OBJECT,
          actionName:'view'
        }
      })
    }

}