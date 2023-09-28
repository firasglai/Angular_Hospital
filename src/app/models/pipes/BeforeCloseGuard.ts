import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ChatWindowComponent } from '../../components/main/chat-window/chat-window.component';


@Injectable({
  providedIn: 'root'
})
export class MyCanDeactivateGuard implements CanDeactivate<ChatWindowComponent> {
  canDeactivate(component: ChatWindowComponent): boolean {
    // Add your custom logic here to decide whether the user can navigate away from the current route or not.
    // For example, you can prompt the user for confirmation before allowing them to leave the page:
    const confirmMessage = 'Are you sure you want to navigate away from this page?';
        // Optionally, you can set a custom message to display in the confirmation dialog
    if(component.call2){
    if(component.user.uid==component.call2.starterId){
      if(component.call?.starteCallWindows?.currentCallwindowID!=component.callWindowId){
        
         return window.confirm(confirmMessage);
       }else return true
    }else{
      if(component.call?.recieverCallWindows?.currentCallwindowID!=component.callWindowId){
        return window.confirm(confirmMessage);
       }else return true
    }
   
  }
else return true}
}
