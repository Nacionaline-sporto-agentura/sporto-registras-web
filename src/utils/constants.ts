export enum ServerErrorMessages {
  USER_NOT_FOUND = `Email not found.`,
  WRONG_PASSWORD = 'Wrong password.',
  USER_EXIST = 'User already exists.',
  NOT_FOUND = 'NOT_FOUND',
}

export enum AdminRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TableItemWidth {
  MEDIUM = '76px',
  SMALL = '40px',
  LARGE = 'auto',
}

export enum AuthStrategy {
  PASSWORD = 'PASSWORD',
}

export enum TenantTypes {
  MUNICIPALITY = 'MUNICIPALITY',
  ORGANIZATION = 'ORGANIZATION',
}

export enum Apps {
  USERS = 'USERS',
  REGISTRAS = 'REGISTRAS',
}

export enum FieldTypes {
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  DECIMAL = 'DECIMAL',
}

export enum TagColors {
  BLUE = 'blue',
  BROWN = 'brown',
  GREEN = 'green',
  PINK = 'pink',
  VIOLET = 'violet',
  ORANGE = 'orange',
  SKYBLUE = 'skyblue',
  GREY = 'grey',
}

export enum StatusTypes {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
  DRAFT = 'DRAFT',
}

export const colorsByStatus = {
  [StatusTypes.CREATED]: TagColors.BLUE,
  [StatusTypes.SUBMITTED]: TagColors.VIOLET,
  [StatusTypes.APPROVED]: TagColors.GREEN,
  [StatusTypes.RETURNED]: TagColors.ORANGE,
  [StatusTypes.REJECTED]: TagColors.PINK,
};
