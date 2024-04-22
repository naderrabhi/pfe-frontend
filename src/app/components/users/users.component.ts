import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import {
  DropDownListAllModule,
  DropDownListComponent,
} from '@syncfusion/ej2-angular-dropdowns';
import {
  EditService,
  GridAllModule,
  GridComponent,
  PageService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import {
  NumericTextBoxAllModule,
  RatingAllModule,
} from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import {
  DialogComponent,
  DialogModule,
  DialogUtility,
} from '@syncfusion/ej2-angular-popups';
import { UsersService } from '../../services/users/users.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    GridAllModule,
    RouterModule,
    CommonModule,
    ToolbarModule,
    NumericTextBoxAllModule,
    RatingAllModule,
    DialogModule,
    DatePickerAllModule,
    DropDownListAllModule,
    ReactiveFormsModule,
    CheckBoxModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [
    UsersService,
    ToolbarService,
    EditService,
    PageService,
    ToolbarService,
    EditService,
    PageService,
  ],
})
export class UsersComponent {
  @ViewChild('role') role!: DropDownListComponent;
  @ViewChild('Dialog') public Dialog!: DialogComponent;
  @ViewChild('grid') grid!: GridComponent;

  public usersData!: Users[];
  public editSettings!: Object;
  public toolbar!: string[];
  public nomrules!: Object;
  public prenomrules!: Object;
  public emailrules!: Object;
  public rolerules!: Object;
  public pageSettings!: Object;
  public editparams!: Object;
  public dialogObj: any;

  public roleData: string[] = ['USER', 'TECHNICIEN', 'RESPONSABLE', 'ADMIN'];
  public roleSelectedItem!: any;
  public userForUpdate!: any;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe((data: any) => {
      this.usersData = data.user;
    });

    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Dialog',
    };
    this.toolbar = ['Add', 'Edit', 'Delete'];
    this.nomrules = { required: true };
    this.prenomrules = { required: true };
    this.emailrules = { required: true };
    this.rolerules = { required: true };
    this.editparams = { params: { popupHeight: '300px' } };
    this.pageSettings = { pageCount: 5 };
  }

  createUser(user: Users, args: any) {
    user.nom = args.data.nom;
    user.prenom = args.data.prenom;
    user.email = args.data.email;
    user.isAccepted = args.data.isAccepted;
    user.isAvailable = args.data.isAvailable;
    user.role = this.roleSelectedItem;
    this.role.clear();

    return user;
  }

  actionBegin(args: any) {
    if (args.requestType === 'save') {
      if (args.data.id) {
        let user: Users = new Users();
        user = this.createUser(user, args);
        user.id = args.data.id;
        this.usersService.updateUser(user).subscribe((resultat) => {
          this.ngOnInit();
        });
      } else {
        let user: Users = new Users();
        user.password = '123456';
        user = this.createUser(user, args);
        this.usersService.createUser(user).subscribe((resultat) => {
          this.ngOnInit();
        });
      }
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const deletedDataId = args.data[0].id;
      this.dialogObj = DialogUtility.confirm({
        title: `Supprimer ${args.data[0].nom} ${args.data[0].prenom}`,
        content: `Vous voulez supprimer cette user?`,
        okButton: {
          click: this.deleteUser.bind(this, deletedDataId),
        },
        cancelButton: { click: this.confirmCancelAction.bind(this) },
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
      });
    }

    if (args.requestType === 'beginEdit') {
      this.usersService
        .getUserById(args.rowData.id)
        .subscribe((response: any) => {
          this.userForUpdate = response.message;
          this.role.value = this.userForUpdate.role;
        });
    }

    if (args.requestType === 'cancel') {
      this.role.clear();
    }
  }

  public deleteUser(id: any) {
    this.usersService.deleteUser(id).subscribe((res) => {
      this.dialogObj.hide();
      this.usersData = this.usersData.filter((item) => item.id !== id);
      this.ngOnInit();
    });
  }

  private confirmCancelAction() {
    this.dialogObj.hide();
  }
}