export interface ACFImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    "thumbnail-width": number;
    "thumbnail-height": number;
    medium: string;
    "medium-width": number;
    "medium-height": number;
    medium_large: string;
    "medium_large-width": number;
    "medium_large-height": number;
    large: string;
    "large-width": number;
    "large-height": number;
    "1536x1536": string;
    "1536x1536-width": number;
    "1536x1536-height": number;
    "2048x2048": string;
    "2048x2048-width": number;
    "2048x2048-height": number;
  };
}

export interface HeroSectionData {
  acf_fc_layout: string;
  doctor_title: string;
  doctor_name: string;
  doctor_sub_title: string;
  doctor_hero_description: string;
  doctor_hero_image: ACFImage;
  button_1: string;
  button_1_link: string;
}

export interface NavBarItem {
  acf_fc_layout: string;
  nav_bar_tab_name: string;
  tab_link: string;
}

export interface FacilityItem {
  acf_fc_layout: string;
  facilities_icon: ACFImage;
  facility_title: string;
  facility_description: string;
}

// Services Section Types
export interface ServiceItem {
  id: number;
  acf: {
    service_title: string;
    service_icon: ACFImage;
    service_description: string;
  };
}

// Schedule Section Types
export interface ScheduleDetail {
  acf_fc_layout: string;
  schedule_icon: ACFImage | false; // Can be an image object or false if empty
  schedule_text_1: string;
  schedule_text_2: string;
}

export interface ACFData {
  hero: HeroSectionData[];
  // ... existing fields ...
  nav_bar: NavBarItem[];
  button_header: string;
  button_header_link: string;
  sf_title: string;
  sf_section_title: string;
  facilities_list: FacilityItem[];
  // About Me Section
  am_title: string;
  am_doctor_name: string;
  doctor_about_description: string;
  doctor_about_image: ACFImage;
  button_2: string;
  button_2_link: string;
  // Services Section
  ser_title: string;
  ser_section_title: string;
  ser_sub_title: string;
  service_available_time: string;
  services_list: ServiceItem[];
  // Events Section
  ev_title: string;
  ev_section_title: string;
  e_text_1: string;
  e_doctor_name: string;
  e_doctor_position: string;
  e_text_2: string;
  bullet_points: BulletPoint[];
  events_doctor_image: ACFImage;
  // Events Dynamic Section
  ev_upcoming_ev_title: string;
  recent_past_ev_title: string;
  ev_booking_title: string;
  ev_whatsapp_number: string;
  button_3: string;
  button_3_link: string;
  // Schedule Section
  sce_title: string;
  sce_section_title: string;
  sce_sub_topic: string;
  sce_main_topic: string;
  scedule_details: ScheduleDetail[];
  schedule_doctor_image: ACFImage;
  button_4: string;
  button_4_link: string;
  // Online Channeling Section
  oc_title: string;
  oc_section_title: string;
  booking_topic: string;
  chaneling_list: ChannelingItem[];
  payment_title: string;
  payment_options: PaymentMethodItem[];
  channeling_doctor_image: ACFImage;
  button_5: string;
  button_5_link: string;
  // Blog Section
  blog_title: string;       // e.g. "Visit my blog and keep your feedback"
  blog_section_title: string; // e.g. "Blog News"

  // Resources Section
  res_title: string;
  res_section_title: string;

  // Video Learning Section
  v_title: string;
  v_section_title: string;
  v_sub_topic: string;
  button_6: string;
  button_6_link: string;
  v_bottom_small_text: string;

  // Testimonial Section
  test_title: string;
  test_section_title: string;
  feedback_list: TestimonialItem[];
}

export interface BlogPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  acf: {
    blog_image: ACFImage;
    blog_title: string;
    blog_category: string;
    blog_time: string;
    blog_description: string;
  };
}

export interface ChannelingItem {
  acf_fc_layout: string;
  channeling_icon: ACFImage;
  channeling_text: string;
}

export interface PaymentMethodItem {
  acf_fc_layout: string;
  payment_image: ACFImage;
  payment_text: string;
}

export interface BulletPoint {
  acf_fc_layout: string;
  bullet_text: string;
  bullet_icon: boolean | ACFImage; // User data showed boolean false or object
}

export interface EventItem {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  acf: {
    event_name: string;
    event_image: ACFImage;
    event_location: string;
    event_date_and_time: string; // "December 10, 2026 12:00 am"
    event_description: string;
  };
}

export interface ResourceItem {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    resource_title: string;
    resource_description: string;
    resource_image: ACFImage;
    resource_pdf: ACFImage;
    download_icon: ACFImage;
  };
}

export interface VideoItem {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    video_link: string;
    video_image: ACFImage;
  };
}

export interface ShortItem {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    short_video_link: string;
    short_video_image: ACFImage;
  };
}

export interface TestimonialItem {
  acf_fc_layout: string;
  user_photo_feedback: ACFImage;
  f_user_position: string;
  f_user_name: string;
  user_feedback_description: string;
  star_range: string;
}
