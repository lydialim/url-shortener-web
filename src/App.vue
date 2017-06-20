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
                    <md-button @click="openUrl(shortUrl)" >Open URL</md-button>
                    <md-button v-clipboard:copy="shortUrl" v-clipboard:success="shortUrlCopied">
                        Copy URL
                    </md-button>
                </md-card-actions>
            </md-card>
            <md-snackbar md-position="top center" ref="snackbar" md-duration="4000">
                <span>Copied</span>
            </md-snackbar>
    
            <br />
    
            <md-table-card>
                <md-toolbar>
                    <h1 class="md-title">Links</h1>
                    <md-button class="md-icon-button">
                        <md-icon>filter_list</md-icon>
                    </md-button>
    
                    <md-button class="md-icon-button">
                        <md-icon>search</md-icon>
                    </md-button>
                </md-toolbar>
    
                <!--<md-table md-sort="visitDate" md-sort-type="desc" @select="onSelect" @sort="onSort">-->
                <md-table md-sort="visitDate" md-sort-type="desc">
                    <md-table-header>
                        <md-table-row>
                            <md-table-head md-sort-by="shortcode">ShortCode</md-table-head>
                            <md-table-head md-sort-by="longUrl">Long URL</md-table-head>
                            <md-table-head md-sort-by="userAgent">User Agent</md-table-head>
                            <md-table-head md-sort-by="visitDate">Last Visit</md-table-head>
                        </md-table-row>
                    </md-table-header>
    
                    <md-table-body>
                        <md-table-row v-for="(row, rowIndex) in analytics" :key="rowIndex" :md-item="row" md-auto-select md-selection>
                            <md-table-cell v-for="(column, columnIndex) in row" :key="columnIndex" :md-numeric="columnIndex !== 'visitDate'" v-if="columnIndex !== 'type'">
                                {{ column }}
                            </md-table-cell>
                        </md-table-row>
                    </md-table-body>
                </md-table>
    
                <md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]"></md-table-pagination>
                <!--<md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]" @pagination="onPagination"></md-table-pagination>-->
            </md-table-card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

var config = {
  headers: {'Content-Type': 'application/json; charset=utf-8'}
};

export default {
    name: 'app',
    data: () => ({
        shortUrlCreated: false,
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
        }
    }
}
</script>

<<style lang="scss">
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

