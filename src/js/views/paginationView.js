import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = +this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${this._generateMarkupBtnNext(curPage)}`;
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return `${this._generateMarkupBtnPrev(curPage)}`;
    }

    //Other page
    if (curPage < numPages) {
      return `${this._generateMarkupBtnNext(
        curPage
      )}${this._generateMarkupBtnPrev(curPage)}`;
    }
    //Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupBtnNext(currentPage) {
    return `<button data-goto = "${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }

  _generateMarkupBtnPrev(currentPage) {
    return `<button data-goto = "${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>`;
  }
}

export default new PaginationView();
