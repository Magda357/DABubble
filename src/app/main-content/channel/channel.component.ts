import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { User } from '../../shared/models/user.class';
import { UserService } from '../../shared/firebase-services/user.service';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MembershipService } from '../../shared/firebase-services/membership.service';
import { Membership } from '../../shared/models/membership.class';
import { ChannelService } from '../../shared/firebase-services/channel.service';
import { Channel } from '../../shared/models/channel.class';
import { DataService } from '../../shared/services/data.service';
import { PositionService } from '../../shared/services/position.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  slideInUpAnimationSlow,
  slideInleftAnimationSlow,
} from '../../shared/services/animations';
import { SharedComponent } from '../../shared/shared.component';
import { DialogInfoComponent } from '../../shared/components/dialogs/dialog-info/dialog-info.component';
import { ChannelMessage } from '../../shared/models/channel-message.class';
import { DirectMessage } from '../../shared/models/direct-message.class';
import { ChannelMessagesService } from '../../shared/firebase-services/channel-message.service';
import { DirectMessagesService } from '../../shared/firebase-services/direct-message.service';
import { TimeStempService } from '../../shared/services/time-stemp.service';
import { MatCardModule } from '@angular/material/card';

/**
 * Represents the main content area of the application, including the header, menu, and channel components.
 * It manages the subscriptions to user and channel data, as well as the visibility of the menu and channel components
 * based on the responsive window size.
 */
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    SharedComponent,
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: '../main-content.component.html',
  styleUrl: '../main-content.component.scss',
  animations: [slideInUpAnimationSlow, slideInleftAnimationSlow],
})
export class MainContentComponent implements OnInit, OnDestroy {
  users: User[] = [];
  channels: Channel[] = [];
  userMemberships: Membership[] = [];
  currentUserChannels: Channel[] = [];
  isMenuVisible: boolean = true;
  isChannelVisible: boolean = false;

  currentUser: User;

  private usersSubscription?: Subscription;
  private channelsSubscription?: Subscription;
  private userMembershipSubscription?: Subscription;
  private userChannelsSubscription: Subscription = new Subscription();
  private directMessagesSubscription?: Subscription;
  private channelMessagesSubscription?: Subscription;
  private channelMembershipSubscription?: Subscription;

  channelMessages: ChannelMessage[] = [];
  directMessages: DirectMessage[] = [];
  timeStempValue: any;
  oldTimeStempValue: any;
  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  chatInput: string = '';
  chatUser!: User;
  threadMsg: ChannelMessage | DirectMessage | undefined;
  currentChannelID: string = '';
  currentChannel!: Channel;

  menuOpen: boolean = true;
  isThreadVisible: boolean = false;

  chatType: 'channel' | 'message' | 'new' = 'channel';
  idChat!: string;

  chatInputType: 'channel' | 'message' | 'reply' = 'channel';

  constructor(
    private userService: UserService,
    private membershipService: MembershipService,
    private channelService: ChannelService,
    private dataService: DataService,
    private positionService: PositionService,
    private dialog: MatDialog,
    private channelMessagesService: ChannelMessagesService,
    private directMessagesService: DirectMessagesService,
    public timeStempService: TimeStempService,
    private router: ActivatedRoute
  ) {
    this.currentUser = this.dataService.currentUser;

    // Subscribe to users and channels data
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.users = users;
      this.dataService.setUsers(users);
    });

    this.channelsSubscription = this.channelService.channels$.subscribe(
      (channels) => {
        this.channels = channels;
        this.dataService.setChannels(channels);
      }
    );

    // Subscribe to user memberships if currentUser is available
    if (this.currentUser) {
      this.membershipService.getUserMemberships(this.currentUser.id);
      this.userMembershipSubscription =
        this.membershipService.userMemberships$.subscribe((userMemberships) => {
          this.userMemberships = userMemberships;
        });
    }

    /**
     * Subscribes to changes in router parameters and updates chat information accordingly.
     */
    this.router.params.subscribe((params) => {
      this.chatType = params['chat'];
      this.idChat = params['idChat'];
      if (this.channels) this.loadData(this.chatType, this.idChat);
      this.threadMsg = undefined;
    });

    /**
     * Subscribes to changes in the users observable and updates the local users data accordingly.
     */
    this.dataService.users$.subscribe((users) => {
      this.users = users;
    });

    /**
     * Subscribes to changes in the channels observable and updates the local channels data accordingly.
     */
    this.dataService.channels$.subscribe((channels) => {
      this.channels = channels;
      this.loadData(this.chatType, this.idChat);
    });

    /**
     * Subscribes to changes in the menu open status provided by the position service.
     */
    this.positionService.isMenuOpen().subscribe((open) => {
      this.menuOpen = open;
    });
  }

  /**
   * Initializes the component by subscribing to user channels and manage responsive window visibility.
   */
  ngOnInit() {
    this.subscribeToUserChannels();

    this.positionService
      .isResponsiveWindowVisible('menu')
      .subscribe((isVisible) => {
        this.isMenuVisible = isVisible;
      });

    this.positionService
      .isResponsiveWindowVisible('channel')
      .subscribe((isVisible) => {
        this.isChannelVisible = isVisible;
      });
  }

  openDialog() {
    // Hier können Sie jetzt MatDialog verwenden
    // Beispiel: this.dialog.open(MyDialogComponent);
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.channelMembershipSubscription?.unsubscribe();
    this.channelMessagesSubscription?.unsubscribe();
    this.directMessagesSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
    this.channelsSubscription?.unsubscribe();
    this.userMembershipSubscription?.unsubscribe();
    this.userChannelsSubscription.unsubscribe();
  }

  /**
   * Subscribes to the channels that the current user is a member of.
   */
  private subscribeToUserChannels() {
    const subscription = combineLatest([
      this.membershipService.userMemberships$,
      this.channelService.channels$,
    ])
      .pipe(
        map(([memberships, channels]) => {
          return channels.filter((channel) =>
            memberships.some(
              (membership) => membership.channelID === channel.id
            )
          );
        })
      )
      .subscribe((filteredChannels) => {
        this.dataService.setCurrentUserChannels(filteredChannels);
      });

    this.userChannelsSubscription.add(subscription);
  }

  /**
   * Opens a dialog window displaying the provided information.
   * @param info - The information to display in the dialog.
   */
  openDialogInfo(info: string): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }

  /**
   * Checks whether the timestamp should be displayed based on the provided time.
   * @param time - The timestamp to check.
   * @param index - The index of the message in the array.
   * @param chat - The type of chat ('channel' or 'message').
   * @returns A boolean indicating whether the timestamp should be displayed.
   */
  checkTimeStemp(
    time: number,
    index: number,
    chat: 'channel' | 'message'
  ): boolean {
    let msgLength;
    if (chat === 'channel') {
      msgLength = this.channelMessages.length;
    } else {
      msgLength = this.directMessages.length;
    }
    
    const newTimeStemp = this.timeStempService.getTimeStemp(time);
    if (this.oldTimeStempValue === newTimeStemp && index !== 0) return false;
    this.oldTimeStempValue = newTimeStemp;
    return true;
  }

  /**
   * Populates the current channel's members based on channel memberships.
   */
  populateCurrentChannelMembers(): void {
    const memberIDs = this.currentChannelMemberships.map(
      (membership) => membership.userID
    );
    this.currentChannelMembers = this.users.filter(
      (user) => user.id && memberIDs.includes(user.id)
    );
  }

  /**
   * Loads data for direct messaging with the specified chat ID.
   * @param idChat - The ID of the chat for direct messaging.
   */
  directData(idChat: string): void {
    this.loadChatUserData(idChat);
    this.loadDirectMessages();
    this.chatInputType = 'message';
  }

  /**
   * Loads chat user data based on the provided chat ID.
   * @param idChat - The ID of the chat used to retrieve user data.
   */
  loadChatUserData(idChat: string): void {
    let name = idChat.replace(/_/g, ' ');
    let user = this.dataService.getUserByName(name);
    if (user) this.chatUser = user;
  }

  /**
   * Retrieves the ID of the chat user, if available.
   * @returns The ID of the chat user, or undefined if not available.
   */
  getChatUserId(): string | undefined {
    if (!this.chatUser) return undefined;
    else return this.chatUser.id;
  }

  /**
   * Sets thread values based on the provided message.
   * @param msg - The message to set thread values from.
   */
  setThreadValues(msg: ChannelMessage | DirectMessage): void {
    if (msg instanceof ChannelMessage) {
      this.threadMsg = new ChannelMessage(msg);
    } else {
      this.threadMsg = new DirectMessage(msg);
    }
  }

  /**
   * Deletes thread values if the provided flag is true.
   * @param delet - A flag indicating whether to delete thread values.
   */
  deletThreadValues(delet: boolean): void {
    if (delet) this.threadMsg = undefined;
  }

  /**
   * Loads data based on the specified chat type and ID.
   * @param chat - The type of chat ('channel', 'message', or 'new').
   * @param idChat - The ID of the chat.
   */
  loadData(chat: 'channel' | 'message' | 'new', idChat: string): void {
    if (chat === 'channel') {
      this.channelData(idChat);
    } else if (chat === 'message') {
      this.directData(idChat);
    }
  }

  /**
   * Loads data for a channel with the specified ID.
   * @param idChat - The ID of the channel.
   */
  channelData(idChat: string): void {
    this.currentChannelID = this.getChannelIdByName(idChat);
    this.loadChannelData();
    this.chatInputType = 'channel';
  }

  /**
   * Retrieves the ID of a channel based on its name.
   * @param name - The name of the channel.
   * @returns The ID of the channel, or an empty string if not found.
   */
  getChannelIdByName(name: string): string {
    const channel = this.channels.find((channel) => channel.name === name);
    return channel ? channel.id : '';
  }

  /**
   * Asynchronously loads data for the current channel.
   */
  async loadChannelData(): Promise<void> {
    if (this.currentChannelID === '') return;
    this.loadMemberships();
    this.loadMessages();
    await this.fetchCurrentChannel();
    this.populateCurrentChannelMembers();
  }

  /**
   * Loads channel memberships for the current channel.
   */
  loadMemberships(): void {
    this.membershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription =
      this.membershipService.channelMemberships$.subscribe(
        (channelMemberships) => {
          this.currentChannelMemberships = channelMemberships;
        }
      );
  }

  /**
   * Loads messages for the current channel.
   */
  loadMessages(): void {
    this.channelMessagesService.getChannelMessages(this.currentChannelID);
    this.channelMessagesSubscription =
      this.channelMessagesService.channelMessages$.subscribe(
        (channelMessages: ChannelMessage[]) => {
          this.channelMessages = channelMessages.sort(
            (a, b) => a.date - b.date
          );
        }
      );
  }

  /**
   * Loads direct messages between the current user and the chat user.
   */
  loadDirectMessages(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.error('current user id is missing');
      return;
    }
    if (!this.chatUser || !this.chatUser.id) {
      console.error('chat user id is missing');
      return;
    }
    
    this.directMessagesService.getDirectMessages(
      this.currentUser.id,
      this.chatUser.id
    );
    this.directMessagesSubscription =
      this.directMessagesService.directMessages$.subscribe(
        (directMessages: DirectMessage[]) => {
          this.directMessages = directMessages.sort(
            (a, b) => a.date - b.date
          );
        }
      );
  }

  /**
   * Fetches the current channel asynchronously.
   */
  private async fetchCurrentChannel(): Promise<void> {
    try {
      const channel = await this.channelService.getChannelByID(
        this.currentChannelID
      );
      if (channel) {
        this.currentChannel = channel;
      } else {
        this.openDialogInfo('Channel nicht gefunden');
      }
    } catch (error) {
      this.openDialogInfo('Fehler beim Abrufen des aktuellen Channels');
      console.error('Fehler beim Abrufen des aktuellen Channels:', error);
    }
  }
}