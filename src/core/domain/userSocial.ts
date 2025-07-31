interface UserSocialProps {
  userId: string;
  instagram?: string;
  artstation?: string;
  behance?: string;
  phoneNumber?: string;
}

export class UserSocial {
  protected props: UserSocialProps;
  protected constructor(props: UserSocialProps) {
    this.props = props;
  }

  static create(props: UserSocialProps) {
    return new UserSocial(props);
  }
  get userId(): string {
    return this.props.userId;
  }
  get instagram(): string | undefined {
    return this.props.instagram;
  }
  get artstation(): string | undefined {
    return this.props.artstation;
  }
  get behance(): string | undefined {
    return this.props.behance;
  }
  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  set instagram(instagram: string | undefined) {
    this.props.instagram = instagram;
  }
  set artstation(artstation: string | undefined) {
    this.props.artstation = artstation;
  }
  set behance(behance: string | undefined) {
    this.props.behance = behance;
  }
  set phoneNumber(phoneNumber: string | undefined) {
    this.props.phoneNumber = phoneNumber;
  }
}
