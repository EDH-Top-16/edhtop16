export default function APIDocs() {
  return (
    <div className="w-11/12 ml-auto mr-0">
      <h1 id="cedh-top-16-api">cEDH Top 16 API</h1>
      <p>
        Our endpoint is available at <code>https://www.cedhtop16.com/api/</code>
        . Data is returned in json format, and are generally arrays of objects.
        Please include content type and accept headers for{" "}
        <code>application/json</code> in all requests.
      </p>
      <p>
        Please limit requests to 120/min (around 2 per second). Any more will
        result in <code>429: Too Many Requests</code>.
      </p>
      <p>
        Examples provided are using the Python requests library, but any HTTP
        request should do. Most of our endpoints with filtering are done through
        MongoDB-style filters. Invalid filters will result in{" "}
        <code>400: Bad Request</code>.
      </p>
      <pre>
        <code className="lang-python">
          <span className="hljs-keyword">import</span> json{"\n"}
          <span className="hljs-keyword">import</span> requests{"\n"}base_url ={" "}
          <span className="hljs-string">"https://www.cedhtop16.com/api/"</span>
          {"\n"}headers = {"{"}
          <span className="hljs-string">'Content-Type'</span>:{" "}
          <span className="hljs-string">'application/json'</span>,{" "}
          <span className="hljs-string">'Accept'</span>:{" "}
          <span className="hljs-string">'application/json'</span>
          {"}"}
          {"\n"}
        </code>
      </pre>
      <h2 id="getting-tournaments">Getting Tournaments</h2>
      <p>
        Tournament objects generally have an ID, associated name, as well as
        information on when the tournament was created and how many entries
        there were. Their format is as follows:
      </p>
      <pre>
        <code className="lang-json">
          {"{"}TID:{" "}
          <span className="hljs-params">&lt;string: tournament ID&gt;</span>,
          {"\n"}
          <span className="hljs-symbol">tournamentName:</span>{" "}
          <span className="hljs-params">&lt;string: tournament name&gt;</span>,
          {"\n"}
          <span className="hljs-symbol">size:</span>{" "}
          <span className="hljs-params">&lt;int: # entries&gt;</span>,{"\n"}
          <span className="hljs-symbol">date:</span>{" "}
          <span className="hljs-params">&lt;ISO date object or string&gt;</span>
          ,{"\n"}
          <span className="hljs-symbol">dateCreated:</span>{" "}
          <span className="hljs-params">&lt;int: Unix timestamp&gt;</span>
          {"}"}
          {"\n"}
        </code>
      </pre>
      <h2 id="example-get-tournaments-of-at-least-50-entries-played-since-2023-01-14">
        Example - Get tournaments of at least 50 entries played since 2023-01-14
      </h2>
      <p>
        While the <code>date</code> field is easier to read, it is much easier
        to convert dates to Unix timestamp and use integer filtering. You cannot
        filter using both <code>date</code> and <code>dateCreated</code> fields;
        you need to pick one.
      </p>
      <pre>
        <code className="lang-python">
          data = {"{"}
          {"\n"}
          <span className="hljs-string">'size'</span>: {"{"}
          <span className="hljs-string">
            '<span className="hljs-variable">$gte</span>'
          </span>
          : <span className="hljs-number">50</span>
          {"}"},{"\n"}
          <span className="hljs-string">'dateCreated'</span>: {"{"}
          <span className="hljs-string">
            '<span className="hljs-variable">$gte</span>'
          </span>
          : <span className="hljs-number">1673715600</span>
          {"}"}
          {"\n"}
          {"}"}
          {"\n"}tourneys = json.loads(requests.post(base_url +{" "}
          <span className="hljs-string">'list_tourneys'</span>, json=data,
          headers=headers).text){"\n"}
          <span className="hljs-literal">print</span>(tourneys){"\n"}
        </code>
      </pre>
      <p>Gives:</p>
      <pre>
        <code className="lang-python">
          [{"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'SiliconDynasty</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Silicon</span> Dynasty',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">161</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-01-14T12:00:00.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1673715600</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'rybklRiX5tZLBCCSgcqQ</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'ka0s</span>{" "}
          <span className="hljs-number">6</span>! Sponsored by The cEDH Nexus',
          {"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">148</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-01-20T22:43:25.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1674272605</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'MM123</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters January{" "}
          <span className="hljs-number">23</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">127</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-01-28T10:00:00.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1674918000</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Fia6JR9cwYZdoLeDbg3B</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'ka0s</span> Treasure Series',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">74</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-01-29T03:55:20.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1674982520</span>
          {"}"}]{"\n"}
        </code>
      </pre>
      <h2 id="example-get-all-mox-masters-tournaments-1-">
        Example - Get all Mox Masters tournaments (1)
      </h2>
      <p>
        You might notice that Eminence-run tournaments generally have a special,
        human-readable tournament ID instead of a hash-like string. We can take
        advanatage of the fact that all Mox Masters tournaments are simply{" "}
        <code>MM</code> followed by 3 or four digits (1-2 digit month, 2 digit
        year). Let's create a regex for that and pass it with the mongoDB filter{" "}
        <code>$regex</code> for <code>TID</code>.
      </p>
      <pre>
        <code className="lang-python">
          data = {"{"}
          <span className="hljs-string">'TID'</span>: {"{"}
          <span className="hljs-string">'$regex'</span>:{" "}
          <span className="hljs-string">
            r'MM\d{"{"}3,4{"}"}'
          </span>
          {"}"}
          {"}"}
          {"\n"}tourneys = json.loads(requests.post(base_url +{" "}
          <span className="hljs-string">'list_tourneys'</span>, json=data,
          headers=headers).text){"\n"}print(tourneys){"\n"}
        </code>
      </pre>
      <p>Gives:</p>
      <pre>
        <code className="lang-python">
          [{"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'MM1022</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters October{" "}
          <span className="hljs-number">22</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">127</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2022-10-01T03:00:01.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1664607601</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'MM1222</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters December{" "}
          <span className="hljs-number">22</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">127</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2022-12-03T03:00:00.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1670054400</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'MM123</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters January{" "}
          <span className="hljs-number">23</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">127</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-01-28T10:00:00.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1674918000</span>
          {"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'TID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'MM223</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters February{" "}
          <span className="hljs-number">23</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'size</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">127</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'date</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'2023-02-25T09:00:00.000Z</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'dateCreated</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1677333600</span>
          {"}"}]{"\n"}
        </code>
      </pre>
      <h2 id="example-get-all-mox-masters-tournaments-2-">
        Example - Get all Mox Masters tournaments (2)
      </h2>
      <p>
        We can also create a regex using the <code>tournamentName</code> field:
      </p>
      <pre>
        <code className="lang-python">
          <span className="hljs-class">
            <span className="hljs-keyword">data</span> = {"{"}'
            <span className="hljs-title">tournamentName'</span>: {"{"}'$
            <span className="hljs-title">regex'</span>:{" "}
            <span className="hljs-title">r'Mox</span>{" "}
            <span className="hljs-type">Masters</span> (
            <span className="hljs-type">January</span>|
            <span className="hljs-type">February</span>|
            <span className="hljs-type">March</span>|
            <span className="hljs-type">April</span>|
            <span className="hljs-type">May</span>|
            <span className="hljs-type">June</span>|
            <span className="hljs-type">July</span>|
            <span className="hljs-type">August</span>|
            <span className="hljs-type">September</span>|
            <span className="hljs-type">October</span>|
            <span className="hljs-type">November</span>|
            <span className="hljs-type">December</span>) \
            <span className="hljs-title">d</span>
            {"{"}1,2{"}"}'{"}"}
            {"}"}
          </span>
          {"\n"}
          <span className="hljs-title">tourneys</span> =
          json.loads(requests.post(base_url + 'list_tourneys', json=
          <span className="hljs-class">
            <span className="hljs-keyword">data</span>, headers=headers).text)
          </span>
          {"\n"}
          <span className="hljs-title">print</span>(tourneys){"\n"}
        </code>
      </pre>
      <p>Gives the same as the previous example.</p>
      <h2 id="getting-players-entries">Getting Players/Entries</h2>
      <p>
        Players and Entries have a number of fields. All columns from Eminence's
        API are included (found{" "}
        <a href="https://eminence.events/api/docs">here</a>), in addition to two
        more fields:
      </p>
      <pre>
        <code className="lang-json">
          {"{"}colorID: &lt;<span className="hljs-built_in">commander</span>(s)
          color identity, <span className="hljs-built_in">in</span> WUBRG order,{" "}
          <span className="hljs-built_in">or</span> C{" "}
          <span className="hljs-keyword">for</span> colorless (mutally
          exclusive). <span className="hljs-string">'N/A'</span>{" "}
          <span className="hljs-keyword">for</span> unknown{" "}
          <span className="hljs-built_in">or</span> erroneous{" "}
          <span className="hljs-built_in">commander</span> names&gt;,{"\n"}
          <span className="hljs-built_in">commander</span>: &lt;
          <span className="hljs-built_in">commander</span>(s){" "}
          <span className="hljs-built_in">name</span>.{" "}
          <span className="hljs-string">'Unknown Commander'</span>{" "}
          <span className="hljs-keyword">for</span> unkown{" "}
          <span className="hljs-built_in">or</span> erroneous decklist
          links.&gt;{"}"}
          {"\n"}
        </code>
      </pre>
      <p>
        You can filter by any of these columns in addition to any filters for
        tournamnets in a separate entry with key <code>tourneyFilters</code> and
        value of the json object containing all tournament metadata-related
        filters.
      </p>
      <h2 id="example-all-5-color-commander-entries-that-have-top-16-d-a-tournament-with-at-least-64-entries">
        Example - all 5-color commander entries that have top 16'd a tournament
        with at least 64 entries
      </h2>
      <pre>
        <code className="lang-python">
          data = {"{"}
          {"\n"}
          {"    "}
          <span className="hljs-string">'standing'</span>: {"{"}
          <span className="hljs-string">'$lte'</span>:{" "}
          <span className="hljs-number">16</span>
          {"}"}, {"\n"}
          {"    "}
          <span className="hljs-string">'colorID'</span>:{" "}
          <span className="hljs-string">'WUBRG'</span>,{"\n"}
          {"    "}
          <span className="hljs-string">'tourney_filter'</span>: {"{"}
          {"\n"}
          {"        "}
          <span className="hljs-string">'size'</span>: {"{"}
          <span className="hljs-string">'$gte'</span>:{" "}
          <span className="hljs-number">64</span>
          {"}"}
          {"\n"}
          {"    "}
          {"}"}
          {"\n"}
          {"}"}
          {"\n"}entries = json.loads(requests.post(base_url +{" "}
          <span className="hljs-string">'req'</span>, json=data,
          headers=headers).text){"\n"}print(entries){"\n"}
        </code>
      </pre>
      <p>Gives</p>
      <pre>
        <code className="lang-python">
          [{"{"}
          <span className="hljs-symbol">'name</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Takato</span> Mitsuda',{"\n"}
          {"  "}
          <span className="hljs-symbol">'profile</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'KnEzdraHD2V9Czv8PCuqhohTa7F2</span>',
          {"\n"}
          {"  "}
          <span className="hljs-symbol">'decklist</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">
            'https://www.moxfield.com/decks/zHocFJxZb0uruHtZhbitrw
          </span>
          ',{"\n"}
          {"  "}
          <span className="hljs-symbol">'wins</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winsSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winsBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRate</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0.3333333333333333</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRateSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0.4</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRateBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'draws</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'losses</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'lossesSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'lossesBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'standing</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">12</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'WUBRG</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Najeela</span>, the Blade-Blossom',
          {"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters October{" "}
          <span className="hljs-number">22</span>'{"}"},{"\n"} {"{"}
          <span className="hljs-symbol">'name</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Alexander</span> Rice',{"\n"}
          {"  "}
          <span className="hljs-symbol">'profile</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'vc1IkW3bXYdKfplUKozjTmFjNQa2</span>',
          {"\n"}
          {"  "}
          <span className="hljs-symbol">'decklist</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">
            'https://www.moxfield.com/decks/8W6rxWnuU0Sn0WMcYDK_5g
          </span>
          ',{"\n"}
          {"  "}
          <span className="hljs-symbol">'wins</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">3</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winsSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winsBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRate</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0.42857142857142855</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRateSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0.4</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'winRateBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">0.5</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'draws</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'losses</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'lossesSwiss</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'lossesBracket</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">1</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'standing</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">4</span>,{"\n"}
          {"  "}
          <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'WUBRG</span>',{"\n"}
          {"  "}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Kenrith</span>, the Returned King',
          {"\n"}
          {"  "}
          <span className="hljs-symbol">'tournamentName</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Mox</span> Masters December{" "}
          <span className="hljs-number">22</span>'{"}"},{"\n"}
          {"  "}# And so on{"\n"}]{"\n"}
        </code>
      </pre>
      <h2 id="getting-commanders">Getting commanders</h2>
      <p>
        We also provide an endpoint to get commander names, color identities,
        and number of entries. This endpoint does not support filtering, and is
        only useful for at-a-glance analysis. Any more significant analysis
        should be done through <code>req</code> as that includes performance
        information.
      </p>
      <pre>
        <code className="lang-python">
          commanders = json.loads(requests.
          <span className="hljs-built_in">get</span>(base_url +{" "}
          <span className="hljs-string">'get_commanders'</span>,
          headers=headers).<span className="hljs-built_in">text</span>){"\n"}
          <span className="hljs-built_in">print</span>(commanders){"\n"}
        </code>
      </pre>
      <p>gives</p>
      <pre>
        <code className="lang-python">
          [{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Malcolm</span>, Keen-Eyed Navigator /
          Tymna the Weaver', <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'WUB</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">23</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Malcolm</span>, Keen-Eyed Navigator /
          Tana, the Bloodsower', <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'URG</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">28</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Rograkh</span>, Son of Rohgahh / Tevesh
          Szat, Doom of Fools', <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'BR</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">10</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Kenrith</span>, the Returned King',{" "}
          <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'WUBRG</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">24</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Teferi</span>, Temporal Archmage',{" "}
          <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'U</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">2</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Krark</span>, the Thumbless / Sakashima
          of a Thousand Faces', <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'UR</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">31</span>
          {"}"},{"\n"}
          {"  "}
          {"{"}
          <span className="hljs-symbol">'commander</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'Inalla</span>, Archmage Ritualist',{" "}
          <span className="hljs-symbol">'colorID</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-symbol">'UBR</span>',{" "}
          <span className="hljs-symbol">'count</span>
          <span className="hljs-symbol">':</span>{" "}
          <span className="hljs-number">17</span>
          {"}"}
          {"\n"}# And so on{"\n"}]{"\n"}
        </code>
      </pre>
      <p>
        <em>
          Note: for now, 'Minsc &amp; Boo' seems to be breaking an upstream API,
          likely due to the ampersand in its name. We're waiting for this issue
          to be resolved.
        </em>
      </p>
    </div>
  );
}
