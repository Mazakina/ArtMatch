import { randomUUID } from "crypto";

interface UserProps {
  name: string;
  email: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  emailVerified: Date | null;
  image: string | null;
}

export class User {
  protected props: UserProps;
  private _id: string;

  protected constructor(props: UserProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  static create(props: UserProps, id?: string) {
    const user = new User(
      {
        ...props,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    );
    return user;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this.props.name;
  }
  get email(): string {
    return this.props.email;
  }
  get status(): "active" | "inactive" {
    return this.props.status;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get avatar(): string | undefined {
    return this.props.avatar;
  }

  get emailVerified(): Date | null {
    return this.props.emailVerified;
  }
  get image(): string | undefined {
    return this.props.avatar;
  }

  set name(name: string) {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  set email(email: string) {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }
  set status(status: "active" | "inactive") {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }
  set avatar(avatar: string | undefined) {
    this.props.avatar = avatar;
    this.props.updatedAt = new Date();
  }

  set emailVerified(emailVerified: Date | null) {
    this.props.emailVerified = emailVerified;
    this.props.updatedAt = new Date();
  }
  set image(image: string | undefined) {
    this.props.image = image;
    this.props.updatedAt = new Date();
  }
}
