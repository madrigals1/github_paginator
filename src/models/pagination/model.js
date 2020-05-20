const axios = require('axios');
const { GITHUB_TOKEN } = require('../../utils/constants');

class Pagination {
    constructor() {
        this.params = {
            page: 1,
            per_page: 10,
            q: 'nodejs'
        };
        this.headers = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        };
        this.method = 'get';
        this.url = 'https://api.github.com/search/repositories';
    }

    async getCurrentPage() {
        return axios({
            method: this.method,
            url: this.url,
            params: this.params,
            headers: this.headers
        })
            .then(function (response) {
                return response.data.items;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setPage(index) {
        if (index > 10) index = 10;
        if (index < 0) index = 0;

        this.params.page = index;
    }

    getNextPage() {
        return Math.min(10, this.params.page + 1);
    }

    getPreviousPage() {
        return Math.max(1, this.params.page - 1);
    }
}

module.exports = new Pagination();