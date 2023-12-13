public with sharing class MyAccounts {
   
    @AuraEnabled(cacheable=true)
    public static List<Account> accountList(){
        return [select Id , Name , AnnualRevenue , Industry , Phone from Account limit 5];
    }
}