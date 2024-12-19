export const DEFAULT_SIGNUP_FORM = {
  title: 'Default Newsletter Signup',
  embedCode: `<div id="mc_embed_shell">
    <div id="mc_embed_signup">
      <form action="https://weswwim.us13.list-manage.com/subscribe/post?u=a15d6a11b0fb279a814280022&amp;id=23124acf1f" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_self" novalidate>
        <div id="mc_embed_signup_scroll">
          <div class="mc-field-group">
            <input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required placeholder="Email Address" />
          </div>
          <div aria-hidden="true" style="position: absolute; left: -5000px;">
            <input type="text" name="b_a15d6a11b0fb279a814280022_23124acf1f" tabindex="-1" value="" />
          </div>
        </div>
      </form>
    </div>
  </div>`,
  pageType: 'default'
};

const PAGE_TYPE_MAPPING = {
  'case-studies': 'all-case-studies',
  'events': 'all-events',
  'guides': 'all-guides',
  'legal': 'all-legal',
  'news': 'all-news'
};

export const getRelevantSignupForm = (signupForms, currentPageType, currentPageId) => {
  if (!signupForms || signupForms.length === 0) {
    return DEFAULT_SIGNUP_FORM;
  }

  // Priority 1: Specific page match
  const specificPageForm = signupForms.find(form => 
    form.pageType === 'single' && 
    form.specificPage?.some(page => page._id === currentPageId)
  );
  if (specificPageForm?.embedCode) {
    return specificPageForm;
  }


  // Priority 2: Page type match (all-case-studies, all-events, etc.)
  const mappedPageType = PAGE_TYPE_MAPPING[currentPageType];
  const pageTypeForm = signupForms.find(form => 
    form.pageType === mappedPageType
  );
  if (pageTypeForm?.embedCode) {
    return pageTypeForm;
  }

  // Priority 3: Default fallback
  return DEFAULT_SIGNUP_FORM;
}; 