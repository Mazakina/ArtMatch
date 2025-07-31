interface UserProfileProps {
  userId: string;
  bio?: string;
  city?: string;
  address?: string;
  streetNumber?: string;
  bannerUrl?: string;
}

export class UserProfile {
  protected props: UserProfileProps;
  protected constructor(props: UserProfileProps) {
    this.props = props;
  }

  static create(props: UserProfileProps) {
    return new UserProfile(props);
  }
  get userId(): string {
    return this.props.userId;
  }
  get bio(): string | undefined {
    return this.props.bio;
  }
  get city(): string | undefined {
    return this.props.city;
  }
  get address(): string | undefined {
    return this.props.address;
  }
  get streetNumber(): string | undefined {
    return this.props.streetNumber;
  }
  get bannerUrl(): string | undefined {
    return this.props.bannerUrl;
  }

  set bio(bio: string | undefined) {
    this.props.bio = bio;
  }
  set city(city: string | undefined) {
    this.props.city = city;
  }
  set address(address: string | undefined) {
    this.props.address = address;
  }
  set streetNumber(streetNumber: string | undefined) {
    this.props.streetNumber = streetNumber;
  }
  set bannerUrl(bannerUrl: string | undefined) {
    this.props.bannerUrl = bannerUrl;
  }
}
