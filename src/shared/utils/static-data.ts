import collaborate from 'src/assets/GigGlobal Logo.png';
import { IAuthUser } from 'src/features/auth/interfaces/auth.interface';
import { IBuyerDocument } from 'src/features/buyer/interfaces/buyer.interface';
import { ISellerGig } from 'src/features/gigs/interfaces/gig.interface';
import { ICategory } from 'src/features/home/interfaces/home.interface';
import { IRatingTypes } from 'src/features/order/interfaces/review.interface';
import { ISellerDocument } from 'src/features/sellers/interfaces/seller.interface';
import { ISliderImagesText } from 'src/shared/shared.interface';

export const categories: ICategory[] = [
  {
    name: 'Programming & Tech',
    icon: collaborate
  },
  {
    name: 'Graphic & Design',
    icon: collaborate
  },
  {
    name: 'Digital Marketing',
    icon: collaborate
  },
  {
    name: 'Writing & Translation',
    icon: collaborate
  },
  {
    name: 'Video & Animation',
    icon: collaborate
  },
  {
    name: 'Music & Audio',
    icon: collaborate
  },
  {
    name: 'Data',
    icon: collaborate
  },
  {
    name: 'Business',
    icon: collaborate
  }
];

export const initialAuthUserValues: IAuthUser = {
  profilePublicId: null,
  country: null,
  createdAt: null,
  email: null,
  emailVerificationToken: null,
  emailVerified: null,
  id: null,
  passwordResetExpires: null,
  passwordResetToken: null,
  profilePicture: null,
  updatedAt: null,
  username: null,
  browserName: null,
  deviceType: null
};

export const emptyBuyerData: IBuyerDocument = {
  _id: '',
  username: '',
  email: '',
  profilePicture: '',
  country: '',
  isSeller: false,
  purchasedGigs: [],
  createdAt: ''
};

export const emptySellerData: ISellerDocument = {
  _id: '',
  profilePublicId: '',
  fullName: '',
  profilePicture: '',
  username: '',
  email: '',
  description: '',
  country: '',
  oneliner: '',
  skills: [],
  ratingsCount: 0,
  ratingSum: 0,
  ratingCategories: {
    five: { value: 0, count: 0 },
    four: { value: 0, count: 0 },
    three: { value: 0, count: 0 },
    two: { value: 0, count: 0 },
    one: { value: 0, count: 0 }
  },
  recentDelivery: '',
  languages: [],
  responseTime: 0,
  experience: [],
  education: [],
  socialLinks: [],
  certificates: [],
  ongoingJobs: 0,
  completedJobs: 0,
  cancelledJobs: 0,
  totalEarnings: 0,
  totalGigs: 0,
  paypal: '',
  createdAt: ''
};

export const emptyGigData: ISellerGig = {
  _id: '',
  id: '',
  sellerId: '',
  title: '',
  username: '',
  profilePicture: '',
  email: '',
  description: '',
  basicDescription: '',
  basicTitle: '',
  expectedDelivery: '',
  active: true,
  categories: '',
  subCategories: [],
  tags: [],
  ratingsCount: 0,
  ratingSum: 0,
  ratingCategories: {
    five: { value: 0, count: 0 },
    four: { value: 0, count: 0 },
    three: { value: 0, count: 0 },
    two: { value: 0, count: 0 },
    one: { value: 0, count: 0 }
  },
  price: 0,
  coverImage: '',
  createdAt: ''
};

export const ratingTypes: IRatingTypes = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5'
};

export const sliderImages: string[] = [
  'https://img.freepik.com/free-photo/medium-shot-man-working-late-night-laptop_23-2150280979.jpg',
  'https://img.freepik.com/free-photo/young-smiling-pretty-caucasian-schoolgirl-wearing-glasses-sits-desk-with-school-tools-thumbs-up-holds-phone-isolated-green-space-with-copy-space_141793-60111.jpg',
  'https://img.freepik.com/free-photo/team-painters-collaborate-new-rustic-masterpiece-art-craft-atelier_482257-106538.jpg',
  'https://img.freepik.com/free-photo/smiling-businesswoman-shaking-hand-male-partner-group-meeting_1163-4637.jpg'
];

export const sliderImagesText: ISliderImagesText[] = [
  { header: 'Leading the Way to Excellence', subHeader: 'Your Journey, Our Expertise' },
  { header: 'Turning Ideas into Impactful Content', subHeader: 'Innovate. Create. Elevate.' },
  { header: 'Turning Magic into Results', subHeader: 'Spelling Success, One Task at a Time' },
  { header: 'Creating Futures, Delivering Now', subHeader: 'Your Vision, Our Innovation' }
];

export const PASSWORD_TYPE = {
  TEXT: 'text',
  PASSWORD: 'password'
};

export const STATIC_DATA = {
  EMPTY: '',
  USERNAME: 'username',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  EMAIL: 'email',
  COUNTRY: 'country',
  PROFILE_PICTURE: 'profilePicture',
  TITLE: 'title',
  BASIC_TITLE: 'basicTitle',
  BASIC_DESCRIPTION: 'basicDescription',
  DESCRIPTION: 'description',
  CATEGORIES: 'categories',
  SUB_CATEGORIES: 'subCategories',
  TAGS: 'tags',
  PRICE: 'price',
  EXPECTED_DELIVERY: 'expectedDelivery',
  COVER_IMAGE: 'coverImage',
  FULLNAME: 'fullName',
  ONELINER: 'oneliner',
  RESPONSE_TIME: 'responseTime',
  YEAR: 'year',
  MAJOR: 'major',
  UNIVERSITY: 'university',
  COMPANY: 'company',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  LANGUAGE: 'language',
  LEVEL: 'level'
};

export const faqs = [
  {
    question: 'How do I hire a freelancer?',
    answer:
      "You can browse categories or search directly for freelancers. Once you find someone suitable, click 'Contact' or 'Order Now' to begin."
  },
  {
    question: 'How do I start selling my services?',
    answer: 'Register as a seller, set up your profile and gigs, and wait for buyers to reach out or place orders directly.'
  },
  {
    question: 'Is there a fee for using the platform?',
    answer: "Buyers don't pay any extra fees. Sellers are charged a small commission per transaction to keep the platform running."
  },
  {
    question: 'How are payments handled?',
    answer: 'All payments are securely processed and held in escrow until the buyer marks the order as complete.'
  },
  {
    question: 'Can I cancel an order?',
    answer: 'Yes, both buyers and sellers can request cancellations in case of mutual agreement or disputes.'
  }
];

export const homeReviews = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'Graphic Designer',
    avatar: 'https://placehold.co/80x80?text=JD',
    text: 'Working with this platform has been a game-changer. Quality freelancers and seamless payments!'
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'Web Developer',
    avatar: 'https://placehold.co/80x80?text=JS',
    text: 'I consistently find top-tier clients here. The user experience is super smooth.'
  },
  {
    id: 3,
    name: 'Alice Nguyen',
    role: 'Content Writer',
    avatar: 'https://placehold.co/80x80?text=AN',
    text: 'The escrow system gives me peace of mind. Highly recommend for both buyers and sellers.'
  },
  {
    id: 4,
    name: 'Carlos Ruiz',
    role: 'SEO Specialist',
    avatar: 'https://placehold.co/80x80?text=CR',
    text: 'Great community and fast payouts. My go-to place for finding gigs!'
  }
];
