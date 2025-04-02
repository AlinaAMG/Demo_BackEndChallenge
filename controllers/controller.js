const ArticleModel = require('../models/articleModel');

const homePage = (req, res) => {
  return ArticleModel.find()
    .sort({ date: -1 })
    .then((articles) => {

      // display the delete message on the homepage
      const messageDelete = req.query.messageDelete || '';
      const messageSuccess = req.query.messageSuccess || "";

      res.render('homepage', {
        title: 'Home Page',
        articles: articles,
        messageError: '',
        messageSuccess: '',
        messageDelete: messageDelete,
        messageSuccess:messageSuccess,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('404', { messageError: 'No articles founded' });
    });
};

// show  the add new article page
const renderArticlePage = (req, res) => {
  res.render('addNewArticle', {
    message: '',
    msg: '',
    messageError: '',
    messageSuccess: '',
    messageDelete: '',
  });
};

// show the article details page
const renderDetailsPage = (req, res) => {
  const articleId = req.params.articleId;
  ArticleModel.findById(articleId)
    .then((article) => {
      if (!article) {
        return res.render('404', { messageError: 'Article not found' });
      }

      res.render('articleDetails', {
        message: '',
        msg: '',
        article: article,
        messageError: '',
        messageSuccess: '',
        messageDelete: '',
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .render('404', { messageError: 'Error retrieving article Details' });
    });
};

const addNewArticle = (req, res) => {
  const { title, article } = req.body;
  console.log(req.body);

  if (!title || !article) {
    return res.render('addNewArticle', {
      article: '',
      msg: 'All fields are required',
      message: '',
      title: '',
      messageError: '',
      messageSuccess: '',
      messageDelete: '',
    });
  }

  if (title.length < 25 || article.length < 100) {
    return res.render('addNewArticle', {
      message:
        'Title have to be at least 25 characters long and article at least 100 characters long',
      msg: '',
      article: '',
      title: '',
      messageError: '',
      messageSuccess: '',
      messageDelete: '',
    });
  }

  let newArticle = new ArticleModel({
    title: title,
    article: article,
    date: new Date(),
  });
  newArticle
    .save()
    .then(() =>
      res.redirect(`/?messageSuccess=Article successfully added`)
      )
    .catch((err) => {
      if (req.body.title === '' || req.body.article === '') {
        res.render('addNewArticle', {
          message: 'An error ocurred,please try again',
          msg: '',
          article: '',
          title: '',
          messageError: '',
          messageSuccess: '',
          messageDelete: '',
        });
      }
    })
};

const editArticlePage = (req, res) => {
  const articleId = req.params.articleId;
  console.log(articleId);

  ArticleModel.findById(articleId)
    .then((articleInfo) => {
      if (!articleInfo) {
        return res.render('404', { messageError: 'Article not found' });
      }
      return res.render('editArticle', {
        msg: '',
        article: articleInfo,
        title: '',
        messageError: '',
        messageSuccess: '',
        messageDelete: '',
      });
    })
    .catch((err) => {
      console.log(err);
      return res.render('404', { messageError: 'Error retrieing article' });
    });
};

const editArticleForm = (req, res) => {
  const articleId = req.params.articleId;
  console.log(articleId);

  const { title, article } = req.body;
  if (!title || !article) {
    return res.render('editArticle', {
      messageError: 'Title and article are required',
      articleId: articleId,
      title: title,
      article: article,
      messageSuccess: '',
      messageDelete: '',
    });
  }
  ArticleModel.findByIdAndUpdate(
    articleId,
    {
      title: title,
      article: article,
      messageError: '',
      messageSuccess: '',
      messageDelete: '',
    },
    { new: true }
  )
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.render('404', { messageError: 'Article not found' });
      }
      return res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      return res.render('editArticle', {
        messageError: 'Error updating article',
      });
    });
};

const deleteArticle = (req, res) => {
  const articleId = req.params.articleId;

  console.log('Deleting article:', articleId);

  // Find the article and delete it
  ArticleModel.findByIdAndDelete(articleId)
    .then((deletedArticle) => {
      if (!deletedArticle) {
        return res
          .status(404)
          .render('404', { messageError: 'Article not found' });
      }
      res.redirect(`/?messageDelete=Article successfully deleted`);
    })
    .catch((err) => {
      console.error('Error deleting article:', err);
      res
        .status(500)
        .render('404', { messageError: 'Server error while deleting article' });
    });
};

const notFoundPage = (req, res) => {
  res.status(404).render('404', { messageError: '' });
};

module.exports = {
  homePage,
  renderArticlePage,
  renderDetailsPage,
  editArticlePage,
  addNewArticle,
  editArticleForm,
  deleteArticle,
  notFoundPage,
};
