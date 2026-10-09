import type { Schema, Struct } from '@strapi/strapi';

export interface AboutHighlightItem extends Struct.ComponentSchema {
  collectionName: 'components_about_highlight_items';
  info: {
    description: '\u54C1\u724C\u4EAE\u70B9';
    displayName: '\u54C1\u724C\u4EAE\u70B9';
    icon: 'check';
  };
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AboutSubsidiary extends Struct.ComponentSchema {
  collectionName: 'components_about_subsidiarys';
  info: {
    description: '\u5B50\u516C\u53F8';
    displayName: '\u5B50\u516C\u53F8';
    icon: 'building';
  };
  attributes: {
    business: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    legalName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AboutValueItem extends Struct.ComponentSchema {
  collectionName: 'components_about_value_items';
  info: {
    description: '\u4EF7\u503C\u4E3B\u5F20';
    displayName: '\u4EF7\u503C\u4E3B\u5F20';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AwsCapabilityMapping extends Struct.ComponentSchema {
  collectionName: 'components_aws_capability_mappings';
  info: {
    description: '\u80FD\u529B\u6620\u5C04';
    displayName: '\u80FD\u529B\u6620\u5C04';
    icon: 'grid';
  };
  attributes: {
    capability: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AwsCoreMessage extends Struct.ComponentSchema {
  collectionName: 'components_aws_core_messages';
  info: {
    description: '\u6838\u5FC3\u4FE1\u606F';
    displayName: '\u6838\u5FC3\u4FE1\u606F';
    icon: 'message';
  };
  attributes: {
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AwsNarrativePoint extends Struct.ComponentSchema {
  collectionName: 'components_aws_narrative_points';
  info: {
    description: '\u53D9\u4E8B\u8981\u70B9';
    displayName: '\u53D9\u4E8B\u8981\u70B9';
    icon: 'eye';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface AwsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_aws_stat_items';
  info: {
    description: 'AWS\u7EDF\u8BA1';
    displayName: 'AWS\u7EDF\u8BA1';
    icon: 'chart-bar';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface BusinessSection extends Struct.ComponentSchema {
  collectionName: 'components_business_sections';
  info: {
    description: '\u56FE\u6587\u4EA4\u66FF\u5C55\u793A\u5757';
    displayName: '\u56FE\u6587\u5757';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

export interface BusinessUnit extends Struct.ComponentSchema {
  collectionName: 'components_business_units';
  info: {
    description: '\u4E1A\u52A1\u5355\u5143';
    displayName: '\u4E1A\u52A1\u5355\u5143';
    icon: 'briefcase';
  };
  attributes: {
    alias: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    infraRelation: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    scenes: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sections: Schema.Attribute.Component<'business.section', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    tags: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ContactPoint extends Struct.ComponentSchema {
  collectionName: 'components_contact_points';
  info: {
    description: '\u8054\u7CFB\u4FE1\u606F';
    displayName: '\u8054\u7CFB\u4FE1\u606F';
    icon: 'phone';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ContactSuggestion extends Struct.ComponentSchema {
  collectionName: 'components_contact_suggestions';
  info: {
    description: '\u5EFA\u8BAE';
    displayName: '\u5EFA\u8BAE';
    icon: 'lightbulb';
  };
  attributes: {
    content: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ContactUseCase extends Struct.ComponentSchema {
  collectionName: 'components_contact_use_cases';
  info: {
    description: '\u4F7F\u7528\u573A\u666F';
    displayName: '\u4F7F\u7528\u573A\u666F';
    icon: 'check-circle';
  };
  attributes: {
    content: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface HomeCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_home_cta_buttons';
  info: {
    description: 'CTA\u6309\u94AE';
    displayName: 'CTA\u6309\u94AE';
    icon: 'cursor';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String;
  };
}

export interface HomeHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_slides';
  info: {
    description: '\u9996\u9875\u8F6E\u64AD';
    displayName: '\u9996\u9875\u8F6E\u64AD';
    icon: 'picture';
  };
  attributes: {
    bgGradient: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    tags: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface HomeNavCard extends Struct.ComponentSchema {
  collectionName: 'components_home_nav_cards';
  info: {
    description: '\u5BFC\u822A\u5361\u7247';
    displayName: '\u5BFC\u822A\u5361\u7247';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String;
  };
}

export interface HomeStatItem extends Struct.ComponentSchema {
  collectionName: 'components_home_stat_items';
  info: {
    description: '\u7EDF\u8BA1\u6570\u636E';
    displayName: '\u7EDF\u8BA1\u6570\u636E';
    icon: 'chart-bar';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface HomeUpdateItem extends Struct.ComponentSchema {
  collectionName: 'components_home_update_items';
  info: {
    description: '\u6700\u65B0\u52A8\u6001';
    displayName: '\u6700\u65B0\u52A8\u6001';
    icon: 'clock';
  };
  attributes: {
    date: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    tag: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface InfraLayer extends Struct.ComponentSchema {
  collectionName: 'components_infra_layers';
  info: {
    description: '\u57FA\u7840\u8BBE\u65BD\u5C42';
    displayName: '\u57FA\u7840\u8BBE\u65BD\u5C42';
    icon: 'layer-group';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    details: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ProductItem extends Struct.ComponentSchema {
  collectionName: 'components_product_items';
  info: {
    description: '\u4EA7\u54C1';
    displayName: '\u4EA7\u54C1';
    icon: 'box';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    details: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    scene: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SiteFooterLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_site_footer_link_groups';
  info: {
    description: '\u9875\u811A\u94FE\u63A5\u7EC4';
    displayName: '\u9875\u811A\u94FE\u63A5\u7EC4';
    icon: 'menu';
  };
  attributes: {
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SiteNavItem extends Struct.ComponentSchema {
  collectionName: 'components_site_nav_items';
  info: {
    description: '\u5BFC\u822A\u9879';
    displayName: '\u5BFC\u822A\u9879';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.highlight-item': AboutHighlightItem;
      'about.subsidiary': AboutSubsidiary;
      'about.value-item': AboutValueItem;
      'aws.capability-mapping': AwsCapabilityMapping;
      'aws.core-message': AwsCoreMessage;
      'aws.narrative-point': AwsNarrativePoint;
      'aws.stat-item': AwsStatItem;
      'business.section': BusinessSection;
      'business.unit': BusinessUnit;
      'contact.point': ContactPoint;
      'contact.suggestion': ContactSuggestion;
      'contact.use-case': ContactUseCase;
      'home.cta-button': HomeCtaButton;
      'home.hero-slide': HomeHeroSlide;
      'home.nav-card': HomeNavCard;
      'home.stat-item': HomeStatItem;
      'home.update-item': HomeUpdateItem;
      'infra.layer': InfraLayer;
      'product.item': ProductItem;
      'site.footer-link-group': SiteFooterLinkGroup;
      'site.nav-item': SiteNavItem;
    }
  }
}
