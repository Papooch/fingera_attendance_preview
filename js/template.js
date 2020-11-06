
var appTemplate = Handlebars.compile(`
    <div>
        <div class="container-header">
            Docházka za měsíc {{ month }}
            <a href="./own_web_overview" class="close-button">X</a>
        </div>
        <div class="day day-header">
            <span class="day-number"></span>
            <span class="day-of-week">Den</span>
            <span class="intervals interval-header">
                {{#each intervalHeaders}}
                    <span class="hour-number">{{hour}}</span>
                {{/each}}
            </span>
            <span class="sum">Práce</span>
        </div>
        {{#each days}}
        <div class="day {{#if (isWeekend dayOfWeek)}}weekend{{/if}}">
            <span class="day-number">{{day}}.</span>
            <span class="day-of-week">{{dayOfWeek}}</span>
            <span class="intervals">
                {{#if (hasIntervals)}}
                    {{#each intervals}}
                        <span
                            class="interval {{typeClass}}"
                            style="left:{{startPercentage}}%;width:{{widthPercentage}}%"
                        >
                        <div class="interval-tooltip">
                            <div>
                                {{type}}
                            </div>
                            <div>
                                {{startText}} - {{endText}}
                            </div>
                            <div>
                                ({{ durationText }})
                            </div>
                        </div>
                        </span>
                {{/each}}
                {{else}}
                    
                {{/if}}
                {{#each ../intervalHeaders}}
                    <span class="hour-number"></span>
                {{/each}}
            </span>
            <span class="sum">{{ hoursMins workMinutes}}</span>
        </div>
        {{/each}}
        <div class="day footer">
            <span class="day-number"></span>
            <span class="day-of-week"></span>
            <span class="intervals footer">
                {{#each intervalHeaders}}
                    <span class="hour-number">{{hour}}</span>
                {{/each}}
            </span>
            <span class="sum">{{ hoursMins totalMinutes }}*</span>
        </div>
        <br>
        *<small>Tento údaj nebude sedět přesně s časem, který ukazuje Fingera, jelikož data, co jsou k dispozici jsou s přesností minut a ne sekund.</small>
    </div>
`);