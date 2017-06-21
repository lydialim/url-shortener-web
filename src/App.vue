<template>
    <div id="app" class="container">
        <md-whiteframe md-tag="md-toolbar" class="md-large md-toolbar-container">
            <md-layout md-gutter class="urly-page-header">
                <md-layout md-flex="50">
                    <div class="md-title">Simplify your links</div>
                </md-layout>
                <md-layout md-flex="75">
                    <md-input-container class="urly-form">
                        <md-input placeholder="Your original URL here" v-model="originalUrl"></md-input>
                    </md-input-container>
                </md-layout>
                <md-layout>
                    <md-button @click="createShortUrl(originalUrl)" class="md-raised">Shorten URL</md-button>
                </md-layout>
            </md-layout>
        </md-whiteframe>
    
        <div class="urly-page-content">
            <md-card v-if="shortUrlCreated">
                <md-card-header>
                    <div class="md-title">{{ shortUrl }}</div>
                    <div class="md-subhead">{{ savedUrl }}</div>
                </md-card-header>
                <md-card-actions>
                    <md-button @click="openUrl(shortUrl)">Open URL</md-button>
                    <md-button v-clipboard:copy="shortUrl" v-clipboard:success="shortUrlCopied">
                        Copy URL
                    </md-button>
                </md-card-actions>
            </md-card>
            <md-snackbar md-position="top center" ref="snackbar" md-duration="4000">
                <span>URL Copied</span>
            </md-snackbar>
    
            <br />
    
            <md-table-card>
                <md-toolbar>
                    <h1 class="md-title">Links</h1>
                    <md-button class="md-icon-button" v-show="!fetching" @click="fetchHistory">
                            <md-icon md-iconset="fa fa-refresh"></md-icon>
                        </md-button>
                    <md-button class="md-icon-button" v-show="fetching">
                        <md-icon md-iconset="fa fa-refresh fa-spin"></md-icon>
                    </md-button>
                </md-toolbar>
    
                <md-table md-sort="dateAccessed" md-sort-type="desc">
                    <md-table-header>
                        <md-table-row>
                            <md-table-head>ShortCode</md-table-head>
                            <md-table-head>Long URL</md-table-head>
                            <md-table-head>User Agent</md-table-head>
                            <md-table-head>IP Address</md-table-head>
                            <md-table-head>Last Visit</md-table-head>
                        </md-table-row>
                    </md-table-header>
    
                    <md-table-body>
                        <md-table-row v-for="(row, rowIndex) in analytics" :key="rowIndex">
                            <md-table-cell v-for="(column, columnIndex) in row" :key="columnIndex">
                                <span v-if="columnIndex === 'dateAccessed'">{{ column | formatDate }}</span>
                                <span v-else>{{ column }}</span>
                            </md-table-cell>
                        </md-table-row>
                    </md-table-body>
                </md-table>
    
            </md-table-card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

var config = {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
};

export default {
    name: 'app',
    data: () => ({
        shortUrlCreated: false,
        fetching: false,
        originalUrl: '',
        shortUrl: '',
        savedUrl: '',
        analytics: []
    }),
    methods: {
        shortUrlCopied() {
            this.$refs.snackbar.open();
        },
        openUrl(url) {
            window.open(url, '_blank');
        },
        createShortUrl(longUrl) {
            if (longUrl === undefined || longUrl === null || longUrl.length < 3) {
                return;
            }

            axios
                .post(`http://u.lydialim.com/api/create`, { url: longUrl }, config)
                .then(response => {
                    if (response.status === 201) {
                        this.shortUrl = `http://u.lydialim.com/${response.data}`;
                        this.shortUrlCreated = true;
                        this.savedUrl = longUrl;
                    }
                })
                .catch(e => {
                    console.log(e);
                })
        },
        fetchHistory() {
            this.fetching = true;

            axios
                .get(`http://u.lydialim.com/api/history`, config)
                .then(response => {
                    this.analytics = response.data;
                    this.fetching = false;
                    console.log("Data refreshed.");
                })
                .catch(e => {
                    this.fetching = false;
                    console.log(e);
                })
        },
    }
}
</script>

<style lang="scss">
.urly-page-header {
    margin: 8px;
}

.urly-page-content {
    padding: 10px;
}

.urly-form {
    margin-left: 8px;
}
</style>

