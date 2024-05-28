export const renderHome = (req, res) => {
    res.render('home', { message: req.flash('message') });
};
