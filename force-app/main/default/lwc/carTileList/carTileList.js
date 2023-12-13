import { LightningElement,wire } from 'lwc';

import getCars from '@salesforce/apex/CarController.getCars';

// Lightining message Service and message channel
import { publish,subscribe,MessageContext } from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c';


export default class CarTileList extends LightningElement {

    cars=[];
    error
    filters={};
    carFilterSubscription

    @wire(getCars, { filters: '$filters' })
    wiredCars({ error, data }) {
        if (data) {
            this.cars = data;
            this.error = undefined;
            console.log('Fetched cars:', data);
        } else if (error) {
            this.error = error;
            this.cars = undefined;
            console.error('Error fetching cars:', error);
        }
    }

    /**Load Context of LMS */
    @wire(MessageContext)
    messageContext


    connectedCallback(){
        this.subscribeHandler();
    }

    subscribeHandler(){
        this.carFilterSubscription=subscribe(this.messageContext,CARS_FILTERED_MESSAGE,(message)=>this.handlerFilterChanges(message));
    }

    handlerFilterChanges(message){
        console.log(message.filters);
        this.filters = { ...message.filters };
        
    }

    handleCarSelected(event){
        console.log('Car Id',event.detail);
        publish(this.messageContext,CARS_SELECTED_MESSAGE,{carId:event.detail});
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription);
        this.carFilterSubscription=null;
      }


}