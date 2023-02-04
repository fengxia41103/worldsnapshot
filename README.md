# worldsnapshot

Inspired by [DATA USA][] this is a REACT project that utilize public data API for data visualization. In particular, the application will illustrate a snapshot of a country using data such as the World Bank API and the DHS dataset.

> demo: [A World Snapshot][]

[data usa]: https://datausa.io/ [a world snapshot]: http://worldsnapshot.s3-website-us-east-1.amazonaws.com/

## Data sources

1. [DHS][]: [DHS][] data set is published by [US AID][]. Following its [API][] documents, [indicators][] are selected to depict a country's well doing.
2. [The World Bank]: Another comprehensive data set is [The World Bank][] set. Check out its [indicators][1] page for a list of available indexes. Note that [official document][2] is still refering to _v1_ version of the API, which will block on CORS requests. Using **v2/en** endpoint instead. For example, to get a list of country names:

<pre class="brush:javascript">
var api = "http://api.worldbank.org/v2/en/countries?format=json&per_page=1000";
</pre>

[data usa]: https://datausa.io/
[dhs]: http://dhsprogram.com/data/
[us aid]: https://www.usaid.gov/
[api]: http://api.dhsprogram.com/#/index.html
[indicators]: http://api.dhsprogram.com/#/api-indicators.cfm
[the world bank]: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-api-indicator-queries
[1]: http://data.worldbank.org/indicator
[2]: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589

## Toolset

- [Materialize][]: "A modern responsive front-end framework based on Material Design" by their words.
- [REACT][]: core
- [webpack][]: new module builder that is making lot of buzz these days.
- [fetch][]: a new way to talk to API endpoints instead of `jQuery AJAX`.

[materialize]: http://materializecss.com/
[react]: https://facebook.github.io/react/
[webpack]: https://webpack.github.io/
[fetch]: https://github.com/github/fetch

## Development

1. Install `nvm` and node 9.4.
1. `npm install`: to pull all dependencies
1. `npm run dev`
1. browse `localhost:8080`, browser will auto-refresh when webpack detects a change to source files.

## Deploy

1. `npm run build`
2. goto `/dist`
3. `pip install awscli`
4. assuming you have setup your AWS account, `aws s3 sync . s3://snapshots.world/`.
5. verify on a browser.
