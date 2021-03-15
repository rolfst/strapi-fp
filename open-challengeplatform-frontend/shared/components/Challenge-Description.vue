<template>
  <div class="description-input--wysiwyg" id="_challenge-description">
    <div id="pell-description" class="pell"></div>
  </div>
</template>

<script>
import pell from 'pell';
import striptags from 'striptags';

export default {
  methods: {
  },
  data () {
    return {
      content: ''
    };
  },
  mounted () {
    const configDescription = {
      element: document.getElementById('pell-description'),
      onChange: (html) => {
        html = striptags(html, ['p', 'br', 'ul', 'ol', 'li', 'h3', 'div', 'u']); // remove all html except the listed tags

        this.$emit('description-details-html', this.content);
        this.content = html;
      },
      actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        {
          name: 'h3',
          icon: '<b>H<sub>3</sub></b>',
          title: 'Heading 3',
          result: () => pell.exec('formatBlock', '<h3>')
        },
        'paragraph',
        'olist',
        'ulist'
      ]
    };
    pell.init(configDescription);
  }
};
</script>

<style lang="scss" scoped>
  .description-input--wysiwyg {
    width: 100%;
    align-items: center;
    }

  .pell{
    .pell-content {
    padding: 10px;
    min-height: 50px;
    max-height: 300px;
    overflow: scroll;
    width: 100%;
    background-color: red;
  }
}
</style>
