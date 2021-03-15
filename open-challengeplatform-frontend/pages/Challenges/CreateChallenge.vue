<template>
  <div class="create-challenge-page">
    <div class="page-title">
      <h1 v-if="mode === 'create'" id="_challenge-title">
        {{ $t('create-challenge--title') }}
      </h1>
      <h1 v-if="mode === 'edit'" id="_challenge-title">
        {{ $t('create-challenge--edit-title') }}
      </h1>
      <h2>{{ $t('create-challenge--subtitle') }}</h2>
    </div>
    <div class="challenge-form-section">
      <create-challenge-service endpoint="/challenges">
        <div slot-scope="{ editChallenge: editChallenge, createChallenge: createChallenge }">
          <div class="challenge-form">
            <div class="challenge-form-left">
              <div class="section moderators">
                <h2>{{ $t('moderators') }}</h2>
                <p>{{ $t('create-challenge--moderators--about') }}</p>
                <p><b>{{ $t('moderators') }}</b></p>
                <div class="form-control field-small">
                  <input type="text" icon="true" required>
                  <img
                    src="../../assets/images/search-icon.svg"
                    class="icon input-icon"
                    :alt="searchIconAltText"
                    :title="searchIconAltText"
                  >
                </div>
                <div class="moderators-selected">
                  <moderator-tag />
                </div>
              </div>
              <div class="section description">
                <h2>{{ $t('description') }}</h2>
                <p>{{ $t('create-challenge--challenge-description-about') }}</p>
                <div class="flex-container">
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--corporate-name') }}</label>
                    <input
                      id="corporate-name"
                      v-model="challengeObject.company.name"
                      type="text"
                      class="field-small"
                      :placeholder="corporateNamePlaceholder"
                      required
                    >
                  </div>
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--corporate-logo') }}</label>
                    <input ref="dummyFile" type="text" icon="true" required>
                    <input
                      id="corporate-logo"
                      ref="company_logo_file"
                      type="file"
                      icon="true"
                      required
                      style="position: absolute;margin-top: -57px;opacity: 0;"
                      @change="handleCompanyLogoFileUpload()"
                    >
                    <img
                      src="../../assets/images/upload.svg"
                      class="input-icon"
                      :alt="uploadIconAltText"
                      :title="uploadIconAltText"
                    >
                  </div>
                </div>
                <div class="form-control field-long">
                  <label>
                    {{ $t('create-challenge--corporate-description') }}&nbsp;
                    (<span class="lowercase">{{ $t('optional') }}</span>)
                  </label>
                  <input
                    id="corporate-description"
                    v-model="challengeObject.company.description"
                    class="field-long"
                    type="text"
                    :placeholder="corporateDescriptionPlaceholder"
                  >
                </div>
                <div class="form-control">
                  <label>{{ $t('create-challenge--challenge-title') }}</label>
                  <input
                    id="challenge-title"
                    v-model="challengeObject.title"
                    type="text"
                    class="field-long"
                    required
                    :placeholder="challengeTitlePlaceholder"
                  >
                  <div v-if="errors.title" class="error-messages">
                    {{ $t('error--please-enter-challenge--title') }}
                  </div>
                </div>
                <div class="form-control">
                  <label>
                    {{ $t('create-challenge--challenge-summary') }}&nbsp;
                    ({{ $t('create-challenge--max-characters') }})</label>
                  <textarea
                    id="challenge-summary"
                    v-model="challengeObject.summary"
                    type="text"
                    class="field-long"
                    required
                    maxlength="300"
                    :placeholder="challengeSummaryPlaceholder"
                  />
                  <div v-if="errors.summary" class="error-messages">
                    {{ $t('error--please-enter-challenge--summary') }}
                  </div>
                </div>
                <div class="flex-container">
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--challenge-start-date') }}</label>
                    <input
                      id="trigger-challenge-start-date"
                      v-model="challengeObject.start_date"
                      type="text"
                      icon="true"
                      placeholder="YYYY-MM-DD"
                      required
                    >
                    <img
                      src="../../assets/images/calendar.svg"
                      class="input-icon"
                      :alt="calendarIconAltText"
                      :title="calendarIconAltText"
                    >
                    <div v-if="errors.start_date" class="error-messages">
                      {{ $t('error--please-enter-challenge--start-date') }}
                    </div>
                  </div>
                  <div style="position: absolute; left: 0;">
                    <airbnb-style-datepicker
                      class="datepicker"
                      :trigger-element-id="'trigger-challenge-start-date'"
                      :date-one="challengeObject.start_date"
                      :date-two="challengeObject.end_date"
                      @date-one-selected="function(startDate) { challengeObject.start_date = startDate }"
                      @date-two-selected="function(endDate) { challengeObject.end_date = endDate }"
                    />
                  </div>
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--challenge-end-date') }}</label>
                    <input
                      id="trigger-challenge-end-date"
                      v-model="challengeObject.end_date"
                      type="text"
                      icon="true"
                      placeholder="YYYY-MM-DD"
                      required
                    >
                    <img
                      src="../../assets/images/calendar.svg"
                      class="input-icon"
                      :alt="calendarIconAltText"
                      :title="calendarIconAltText"
                    >
                    <div v-if="errors.end_date" class="error-messages">
                      {{ $t('error--please-enter-challenge--end-date') }}
                    </div>
                  </div>
                  <div style="position: absolute; left: 0;">
                    <airbnb-style-datepicker
                      class="datepicker"
                      :trigger-element-id="'trigger-challenge-end-date'"
                      :date-one="challengeObject.start_date"
                      :date-two="challengeObject.end_date"
                      @date-one-selected="function(startDate) { challengeObject.start_date = startDate }"
                      @date-two-selected="function(endDate) { challengeObject.end_date = endDate }"
                    />
                  </div>
                </div>
                <div class="form-control">
                  <label>
                    {{ $t('create-challenge--challenge-description') }}&nbsp;
                    (<span class="lowercase">{{ $t('optional') }}</span>)
                  </label>
                  <challenge-description
                    :edit-description="challengeObject.body"
                    class="challenge-description--content"
                    @description-details-html="addDescription"
                  />
                  <div v-if="errors.body" class="error-messages">
                    {{ $t('error--please-enter-challenge--description') }}
                  </div>
                </div>
                <div class="flex-container">
                  <div class="form-control field-small">
                    <tags-service endpoint="tags" :params="subject">
                      <div slot-scope="{ tags: tags, getTags: getTags }">
                        <label>{{ $t('subjects') }}</label>
                        <input
                          id="subject"
                          v-model="subject"
                          type="text"
                          icon="true"
                          :placeholder="subjectsPlaceholder"
                          required
                          @blur="blurred(tags)"
                          @input="triggerTagSearch(getTags)"
                        >
                        <img
                          src="../../assets/images/search-icon.svg"
                          class="input-icon"
                          :alt="searchIconAltText"
                          :title="searchIconAltText"
                        >
                        <div v-if="showAutoSuggestTags" class="more-options--options">
                          <ul v-for="tag in tags" :key="tag._id" @click="addTag">
                            <li>{{ tag.title }}</li>
                          </ul>
                        </div>
                      </div>
                    </tags-service>
                  </div>
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--challenge-image') }}</label>
                    <input ref="dummyImage" type="text" icon="true" required>
                    <input
                      id="challenge-image"
                      ref="challenge_image"
                      type="file"
                      icon="true"
                      required
                      style="position: absolute; margin-top: -57px; opacity: 0;"
                      @change="handleChallengeImageUpload()"
                    >
                    <img
                      src="../../assets/images/upload.svg"
                      class="input-icon"
                      :alt="uploadIconAltText"
                      :title="uploadIconAltText"
                    >
                  </div>
                </div>
                <div class="selected-tags">
                  <div v-for="tag in allTags" :key="tag" @click="removeTag(tag)">
                    <tag-component closable="true" color="blue">
                      {{ tag }}
                    </tag-component>
                  </div>
                </div>
                <div class="form-control field-long">
                  <label>
                    {{ $t('create-challenge--challenge-video-url') }}&nbsp;
                    (<span class="lowercase">{{ $t('optional') }}</span>)
                  </label>
                  <input
                    id="video-url"
                    v-model="videoUrl"
                    class="field-long"
                    type="text"
                    :placeholder="videoLinkPlaceholder"
                    icon="true"
                  >
                </div>
                <button class="button primary">
                  {{ $t('create-challenge--add-attachments') }}
                  <input
                    ref="attachments"
                    type="file"
                    style="opacity: 0; position: absolute; margin-left: -96px; margin-top: -27px; height: 34px; width: 191px; cursor: pointer;"
                    multiple
                    required
                    @change="handleAttachments()"
                  >
                </button>
                <div class="attachments">
                  <div v-for="attachment in attachments" :key="attachment[1].id" @click="removeAttachment(attachment[1])">
                    <attachment :attachment="attachment[1]" />
                  </div>
                </div>
              </div>
              <div class="section timeline">
                <h2>{{ $t('timeline') }}</h2>
                <p>{{ $t('create-challenge--timeline-about') }}</p>
                <div v-for="stage in challengeObject.stages" :key="stage.name">
                  <div class="flex-container stage-name">
                    <h3>
                      {{ stage.name }}
                    </h3>
                    <img
                      src="../../assets/images/bin.svg"
                      :alt="binIconAltText"
                      :title="binIconAltText"
                      @click="removeStage(stage)"
                    >
                  </div>
                  <div class="form-control field-long">
                    <label>{{ $t('name') }}</label>
                    <input
                      v-model="stage.name"
                      type="text"
                      class="field-long _set-stage-name"
                      :placeholder="stageNamePlaceholder"
                      required
                    >
                  </div>
                  <div class="flex-container">
                    <div class="form-control field-small">
                      <label>{{ $t('create-challenge--stage--start-date') }}</label>
                      <input
                        v-model="stage.start"
                        type="text"
                        onfocus="(this.type='date')"
                        onfocusout="(this.type='text')"
                        icon="true"
                        class="_set-trigger-stage-start-date"
                        placeholder="YYYY-MM-DD"
                        required
                      >
                      <img
                        src="../../assets/images/calendar.svg"
                        class="input-icon"
                        :alt="calendarIconAltText"
                        :title="calendarIconAltText"
                      >
                    </div>
                  </div>
                  <div class="form-control field-long">
                    <label>{{ $t('description') }}</label>
                    <input
                      v-model="stage.description"
                      type="text"
                      class="field-long _set-stage-description"
                      :placeholder="stageDescriptionPlaceholder"
                      required
                    >
                  </div>
                  <div class="form-control field-small">
                    <select v-model="stage.type" class="select-css _set-stage-type">
                      <option value="event">
                        {{ $t('event') }}
                      </option>
                      <option value="meeting">
                        {{ $t('meeting') }}
                      </option>
                      <option value="selection">
                        {{ $t('selection') }}
                      </option>
                    </select>
                  </div>
                  <hr>
                </div>
                <div>
                  <h3>{{ $t('create-challenge--stage--enter-details') }}</h3>
                  <div class="form-control field-long">
                    <label>{{ $t('name') }}</label>
                    <input
                      id="stage-name"
                      v-model="stageObject.name"
                      type="text"
                      class="field-long"
                      :placeholder="stageNamePlaceholder"
                      required
                    >
                  </div>
                  <div class="flex-container">
                    <div class="form-control field-small">
                      <label>{{ $t('create-challenge--stage--start-date') }}</label>
                      <input
                        id="trigger-stage-start-date"
                        v-model="stageObject.start"
                        type="text"
                        icon="true"
                        placeholder="YYYY-MM-DD"
                        required
                      >
                      <img
                        src="../../assets/images/calendar.svg"
                        class="input-icon"
                        :alt="calendarIconAltText"
                        :title="calendarIconAltText"
                      >
                    </div>
                    <div style="position: absolute; left: 0;">
                      <airbnb-style-datepicker
                        class="datepicker"
                        :mode="'single'"
                        :months-to-show="1"
                        :trigger-element-id="'trigger-stage-start-date'"
                        :date-one="stageObject.start"
                        @date-one-selected="function(startDate) { stageObject.start = startDate }"
                      />
                    </div>
                  </div>
                  <div class="form-control field-long">
                    <label>{{ $t('description') }}</label>
                    <input
                      id="stage-description"
                      v-model="stageObject.description"
                      type="text"
                      class="field-long"
                      :placeholder="stageDescriptionPlaceholder"
                      required
                    >
                  </div>
                  <div class="form-control field-small">
                    <label>{{ $t('create-challenge--stage--type') }}</label>
                    <select
                      id="stage-type"
                      v-model="stageObject.type"
                      class="select-css"
                      :placeholder="stageTypePlaceholder"
                    >
                      <option value="event">
                        {{ $t('event') }}
                      </option>
                      <option value="meeting">
                        {{ $t('meeting') }}
                      </option>
                      <option value="selection">
                        {{ $t('selection') }}
                      </option>
                    </select>
                  </div>
                  <div class="form-control">
                    <button class="button primary" @click="addStageToChallenge">
                      {{ $t('create-challenge--add-stage') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="challenge-form-right">
              <button
                v-if="mode === 'create'"
                class="button primary"
                type="button"
                @click="setFormDataForIngestion(createChallenge)"
              >
                {{ $t('create') }}
              </button>
              <button
                v-if="mode === 'edit'"
                class="button primary"
                type="button"
                @click="setFormDataForIngestion(editChallenge)"
              >
                {{ $t('edit') }}
              </button>
              <button class="button secondary" @click="goBack()">
                {{ $t('back') }}
              </button>
            </div>
          </div>
        </div>
      </create-challenge-service>
    </div>
  </div>
</template>

<script>
import Upload from '../../shared/services/Upload';
import ChallengesServices from '../../shared/services/ChallengesServices';
import ChallengeDescription from '../../shared/components/Challenge-Description';
import ModeratorTag from '../../shared/components/Moderator-Tag';
import AttachmentChallenge from '../../shared/components/Attachment-Challenge';
import TagsService from '../../shared/services/Tags-Service';
import CreateChallengeService from '../../shared/services/CreateChallenge-Service';
import TagComponent from '../../shared/components/Tag';

export default {
  components: {
    'moderator-tag': ModeratorTag,
    'create-challenge-service': CreateChallengeService,
    'tags-service': TagsService,
    'tag-component': TagComponent,
    'challenge-description': ChallengeDescription,
    'attachment': AttachmentChallenge
  },
  props: [
    'openCreateChallengeModal'
  ],
  data () {
    return {
      showAutoSuggestTags: false,
      attachments: [],
      stageObject: {
        start: '',
        name: '',
        type: '',
        description: ''
      },
      challengeObject: {
        company: {
          logo: '',
          name: '',
          description: ''
        },
        summary: '',
        title: '',
        start_date: '',
        end_date: '',
        body: '',
        stages: [],
        tags: []
      },
      allTags: [],
      errors: {},
      binIconAltText: '',
      calendarIconAltText: '',
      challengeSummaryPlaceholder: '',
      challengeTitlePlaceholder: '',
      corporateDescriptionPlaceholder: '',
      corporateNamePlaceholder: '',
      mode: 'create',
      searchIconAltText: '',
      stageDescriptionPlaceholder: '',
      stageNamePlaceholder: '',
      stageTypePlaceholder: '',
      subject: '',
      subjectsPlaceholder: '',
      uploadIconAltText: '',
      videoLinkPlaceholder: '',
      videoUrl: ''
    };
  },
  mounted () {
    this.setMode();
    this.translate();
  },
  methods: {
    blurred (tags) {
      if (tags.length === 0) {
        this.allTags.push(this.subject);
        this.subject = '';
        this.showAutoSuggestTags = false;
      }
    },
    addDescription (value) {
      this.challengeObject.body = value;
    },
    addStageToChallenge: function (e) {
      e.preventDefault();
      const stage = { ...this.stageObject };
      this.challengeObject.stages.push(stage);
      Object.keys(this.stageObject).forEach((key) => {
        this.stageObject[key] = '';
      });
    },
    addTag: function (e) {
      this.allTags.push(e.target.innerHTML);
      this.showAutoSuggestTags = false;
      this.subject = '';
    },
    removeTag (tag) {
      this.allTags = this.allTags.filter((elem) => {
        return elem !== tag;
      });
    },
    removeStage (selectedStage) {
      this.challengeObject.stages = this.challengeObject.stages.filter(function (stage) {
        return stage.name !== selectedStage.name;
      });
    },
    handleCompanyLogoFileUpload () {
      if (this.$refs.company_logo_file.files[0]) {
        this.challengeObject.company.logo = this.$refs.company_logo_file.files[0];
        this.$refs.dummyFile.value = this.challengeObject.company.logo.name;
      } else {
        this.$refs.dummyFile.value = '';
      }
    },
    handleChallengeImageUpload () {
      if (this.$refs.challenge_image.files[0]) {
        this.challengeObject.hero = this.$refs.challenge_image.files[0];
        this.$refs.dummyImage.value = this.challengeObject.hero.name;
      } else {
        this.$refs.dummyImage.value = '';
      }
    },
    handleAttachments () {
      Object.entries(this.$refs.attachments.files).forEach((file) => {
        this.attachments.push(file);
      });
    },
    removeAttachment (file) {
      this.attachments = this.attachments.filter((elem) => {
        return elem[1].name !== file.name;
      });
    },
    triggerTagSearch (fn) {
      if (this.subject.length > 2) {
        this.showAutoSuggestTags = true;
        fn();
      } else {
        this.showAutoSuggestTags = false;
      }
    },
    convertJSONToFormObject () {
      this.challengeObject.tags = this.allTags;
      this.challengeObject.videoUrl = this.videoUrl;
      const formData = new FormData();
      formData.append('data', JSON.stringify(this.challengeObject));
      formData.append('files.hero', this.challengeObject.hero);
      formData.append('files.company.logo', this.challengeObject.company.logo);

      if (this.attachments.length > 0) {
        this.attachments.forEach((attachment, key) => {
          formData.append('files.attachments', attachment[1]);
        });
      }
      return formData;
    },
    setFormDataForIngestion (fn) {
      if (this.validateForm()) {
        const convertedData = this.convertJSONToFormObject();
        this.createChallenge(fn, convertedData, this.challengeObject.slug);
      }
    },
    async createChallenge (fn, convertedData, slug) {
      const result = await fn(convertedData, slug)
        .catch((err) => {
          // TODO: Add proper error handling
          return this.$nuxt.error({ statusCode: 404, message: err });
        });
      this.$router.push(`/challenges/${result.slug}`);
      this.uploadAttachments(result._id, result.slug);
    },
    async uploadAttachments (id, slug) {
      if (this.attachments.length > 0) {
        for (let index = 0; index < this.attachments.length; index++) {
          const formObject = this.setAttachmentFormData(this.attachments[index], id);
          await Upload.uploadAttachment(formObject, 'upload');
        }
      }
      this.$router.push(`/challenges/${slug}`);
    },
    formatAttachments (attachments) {
      const formattedAttachments = [];
      attachments.forEach((attachment) => {
        formattedAttachments.push(attachment[1]);
      });
      return formattedAttachments;
    },
    setAttachmentFormData (attachment, id) {
      const formData = new FormData();
      formData.append('ref', 'challenge');
      formData.append('source', 'challenges');
      formData.append('refId', id);
      formData.append('field', 'attachments');
      formData.append('files', attachment[1]);
      return formData;
    },
    validateForm () {
      this.errors = {};
      Object.keys(this.challengeObject).forEach((key) => {
        if (!this.challengeObject[key]) {
          this.errors[key] = 'required';
        }
      });
      if (Object.keys(this.errors).length === 0) {
        return true;
      };
      return false;
    },
    async setMode () {
      let editSlug = '';
      if (this.$route.path === '/editChallenge') {
        editSlug = this.$store.getters.getEventSlug;
      }
      if (editSlug) {
        this.mode = 'edit';
        const challengeDetails = await ChallengesServices.getChallengeDetails(this.$store.getters.getEventSlug);
        this.setEditData(challengeDetails.data);
      } else {
        this.$router.push('/createChallenge');
      }
    },
    setCompanyDetails (companyDetails) {
      if (companyDetails) {
        this.challengeObject.company.name = companyDetails.name;
        this.challengeObject.company.logo = companyDetails.logo;
        this.challengeObject.company.description = companyDetails.description;
      }
    },
    setStages (stages) {
      this.challengeObject.stages = stages;
    },
    setTags (tags) {
      this.allTags = tags;
    },
    setEditData (challengeDetails) {
      this.setCompanyDetails(challengeDetails.company);
      this.setStages(challengeDetails.stages);
      this.setTags(challengeDetails.tags);
      this.challengeObject.start_date = challengeDetails.start_date;
      this.challengeObject.end_date = challengeDetails.end_date;
      this.challengeObject.title = challengeDetails.title;
      this.challengeObject.summary = challengeDetails.summary;
      this.videoUrl = challengeDetails.videoUrl;
      this.challengeObject.slug = challengeDetails.slug;
      this.challengeObject.id = challengeDetails.id;
      this.challengeObject.body = challengeDetails.body;
    },
    translate () {
      this.binIconAltText = this.$i18n.t('create-challenge--bin-icon--alt-text');
      this.calendarIconAltText = this.$i18n.t('create-challenge--calendar-icon-alt-text');
      this.challengeSummaryPlaceholder = this.$i18n.t('create-challenge--challenge-summary--placeholder');
      this.challengeTitlePlaceholder = this.$i18n.t('create-challenge--challenge-title--placeholder');
      this.corporateDescriptionPlaceholder = this.$i18n.t('create-challenge--corporate-description--placeholder');
      this.corporateNamePlaceholder = this.$i18n.t('create-challenge--corporate-name--placeholder');
      this.searchIconAltText = this.$i18n.t('create-challenge--search-icon--alt-text');
      this.stageDescriptionPlaceholder = this.$i18n.t('create-challenge--stage-description--placeholder');
      this.stageNamePlaceholder = this.$i18n.t('create-challenge--stage-name--placeholder');
      this.stageTypePlaceholder = this.$i18n.t('create-challenge--stage-type--placeholder');
      this.subjectsPlaceholder = this.$i18n.t('create-challenge--subjects--placeholder');
      this.uploadIconAltText = this.$i18n.t('create-challenge--upload-icon--alt-text');
      this.videoLinkPlaceholder = this.$i18n.t('create-challenge--challenge-video-url--placeholder');
    },
    goBack () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.select-css {
  min-height: 50px;
  width: 100%;
}

.attachments {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.selected-tags {
  display: flex;
  margin-bottom: 15px;
}

.pell-content {
    background-color: grey;
  }

.flex-container {
  margin-bottom: 0;

  &.stage-name {
    margin-bottom: 18px;
  }
}

.more-options--options{
  z-index: 99;
  opacity: 1;
  display: block;
  width: 100%;
  li:hover {
    color: white;
    background-color: #aa418c;
  }
}

.field-small {
  flex: 1;
  max-width: 385px;
}

.field-long {
  width: 100%;
}

.section {
  padding-bottom: 60px;
}

.page-title {
  padding-top: 156px;
  padding-bottom: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.challenge-form-section {
  background-color:#F2F4F5;
}

.challenge-form {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 60px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .challenge-form-left {
    flex: 8;
  }

  .challenge-form-right {
    position: -webkit-sticky;
    position: sticky;
    top: 230px;
    text-align: right;
    max-height: 10vh;
    flex: 2;

    button {
      margin-right: 0px;
      margin-bottom: 18px;
    }
  }
}
</style>
