-- Add area column to countries table (in square kilometers)
ALTER TABLE countries ADD COLUMN IF NOT EXISTS area_km2 INTEGER;

-- Update countries with their actual land areas
UPDATE countries SET area_km2 = 0.44 WHERE id = 'VA'; -- Vatican City
UPDATE countries SET area_km2 = 21 WHERE id = 'NR'; -- Nauru
UPDATE countries SET area_km2 = 26 WHERE id = 'TV'; -- Tuvalu
UPDATE countries SET area_km2 = 61 WHERE id = 'SM'; -- San Marino
UPDATE countries SET area_km2 = 160 WHERE id = 'LI'; -- Liechtenstein
UPDATE countries SET area_km2 = 2 WHERE id = 'MC'; -- Monaco
UPDATE countries SET area_km2 = 181 WHERE id = 'MH'; -- Marshall Islands
UPDATE countries SET area_km2 = 468 WHERE id = 'AD'; -- Andorra
UPDATE countries SET area_km2 = 261 WHERE id = 'KN'; -- Saint Kitts and Nevis
UPDATE countries SET area_km2 = 751 WHERE id = 'DM'; -- Dominica
UPDATE countries SET area_km2 = 442 WHERE id = 'AG'; -- Antigua and Barbuda
UPDATE countries SET area_km2 = 459 WHERE id = 'SC'; -- Seychelles
UPDATE countries SET area_km2 = 389 WHERE id = 'VC'; -- Saint Vincent and the Grenadines
UPDATE countries SET area_km2 = 344 WHERE id = 'GD'; -- Grenada
UPDATE countries SET area_km2 = 747 WHERE id = 'TO'; -- Tonga
UPDATE countries SET area_km2 = 702 WHERE id = 'FM'; -- Micronesia
UPDATE countries SET area_km2 = 811 WHERE id = 'KI'; -- Kiribati
UPDATE countries SET area_km2 = 616 WHERE id = 'LC'; -- Saint Lucia
UPDATE countries SET area_km2 = 2842 WHERE id = 'WS'; -- Samoa
UPDATE countries SET area_km2 = 964 WHERE id = 'ST'; -- Sao Tome and Principe
UPDATE countries SET area_km2 = 12189 WHERE id = 'VU'; -- Vanuatu
UPDATE countries SET area_km2 = 430 WHERE id = 'BB'; -- Barbados
UPDATE countries SET area_km2 = 103000 WHERE id = 'IS'; -- Iceland
UPDATE countries SET area_km2 = 316 WHERE id = 'MT'; -- Malta
UPDATE countries SET area_km2 = 5765 WHERE id = 'BN'; -- Brunei
UPDATE countries SET area_km2 = 765 WHERE id = 'BH'; -- Bahrain
UPDATE countries SET area_km2 = 9251 WHERE id = 'CY'; -- Cyprus
UPDATE countries SET area_km2 = 23200 WHERE id = 'DJ'; -- Djibouti
UPDATE countries SET area_km2 = 18274 WHERE id = 'FJ'; -- Fiji
UPDATE countries SET area_km2 = 38394 WHERE id = 'BT'; -- Bhutan
UPDATE countries SET area_km2 = 2235 WHERE id = 'KM'; -- Comoros
UPDATE countries SET area_km2 = 28051 WHERE id = 'GQ'; -- Equatorial Guinea
UPDATE countries SET area_km2 = 45228 WHERE id = 'EE'; -- Estonia
UPDATE countries SET area_km2 = 2040 WHERE id = 'MU'; -- Mauritius
UPDATE countries SET area_km2 = 17364 WHERE id = 'SZ'; -- Eswatini
UPDATE countries SET area_km2 = 5128 WHERE id = 'TT'; -- Trinidad and Tobago
UPDATE countries SET area_km2 = 36125 WHERE id = 'GW'; -- Guinea-Bissau
UPDATE countries SET area_km2 = 64589 WHERE id = 'LV'; -- Latvia
UPDATE countries SET area_km2 = 20273 WHERE id = 'SI'; -- Slovenia
UPDATE countries SET area_km2 = 25713 WHERE id = 'MK'; -- North Macedonia
UPDATE countries SET area_km2 = 30355 WHERE id = 'LS'; -- Lesotho
UPDATE countries SET area_km2 = 581730 WHERE id = 'BW'; -- Botswana
UPDATE countries SET area_km2 = 11295 WHERE id = 'GM'; -- Gambia
UPDATE countries SET area_km2 = 11586 WHERE id = 'QA'; -- Qatar
UPDATE countries SET area_km2 = 65300 WHERE id = 'LT'; -- Lithuania
UPDATE countries SET area_km2 = 28748 WHERE id = 'AL'; -- Albania
UPDATE countries SET area_km2 = 10991 WHERE id = 'JM'; -- Jamaica
UPDATE countries SET area_km2 = 1564110 WHERE id = 'MN'; -- Mongolia
UPDATE countries SET area_km2 = 29743 WHERE id = 'AM'; -- Armenia
UPDATE countries SET area_km2 = 176215 WHERE id = 'UY'; -- Uruguay
UPDATE countries SET area_km2 = 69700 WHERE id = 'GE'; -- Georgia
UPDATE countries SET area_km2 = 51197 WHERE id = 'BA'; -- Bosnia and Herzegovina
UPDATE countries SET area_km2 = 33846 WHERE id = 'MD'; -- Moldova
UPDATE countries SET area_km2 = 17818 WHERE id = 'KW'; -- Kuwait
UPDATE countries SET area_km2 = 56594 WHERE id = 'HR'; -- Croatia
UPDATE countries SET area_km2 = 309500 WHERE id = 'OM'; -- Oman
UPDATE countries SET area_km2 = 10452 WHERE id = 'LB'; -- Lebanon
UPDATE countries SET area_km2 = 719 WHERE id = 'SG'; -- Singapore
UPDATE countries SET area_km2 = 338424 WHERE id = 'FI'; -- Finland
UPDATE countries SET area_km2 = 49035 WHERE id = 'SK'; -- Slovakia
UPDATE countries SET area_km2 = 385207 WHERE id = 'NO'; -- Norway
UPDATE countries SET area_km2 = 70273 WHERE id = 'IE'; -- Ireland
UPDATE countries SET area_km2 = 51100 WHERE id = 'CR'; -- Costa Rica
UPDATE countries SET area_km2 = 268838 WHERE id = 'NZ'; -- New Zealand
UPDATE countries SET area_km2 = 111369 WHERE id = 'LR'; -- Liberia
UPDATE countries SET area_km2 = 622984 WHERE id = 'CF'; -- Central African Republic
UPDATE countries SET area_km2 = 75420 WHERE id = 'PA'; -- Panama
UPDATE countries SET area_km2 = 1030700 WHERE id = 'MR'; -- Mauritania
UPDATE countries SET area_km2 = 43094 WHERE id = 'DK'; -- Denmark
UPDATE countries SET area_km2 = 488100 WHERE id = 'TM'; -- Turkmenistan
UPDATE countries SET area_km2 = 71740 WHERE id = 'SL'; -- Sierra Leone
UPDATE countries SET area_km2 = 56785 WHERE id = 'TG'; -- Togo
UPDATE countries SET area_km2 = 41285 WHERE id = 'CH'; -- Switzerland
UPDATE countries SET area_km2 = 112492 WHERE id = 'HN'; -- Honduras
UPDATE countries SET area_km2 = 83600 WHERE id = 'AE'; -- United Arab Emirates
UPDATE countries SET area_km2 = 83879 WHERE id = 'AT'; -- Austria
UPDATE countries SET area_km2 = 207600 WHERE id = 'BY'; -- Belarus
UPDATE countries SET area_km2 = 143100 WHERE id = 'TJ'; -- Tajikistan
UPDATE countries SET area_km2 = 93028 WHERE id = 'HU'; -- Hungary
UPDATE countries SET area_km2 = 89342 WHERE id = 'JO'; -- Jordan
UPDATE countries SET area_km2 = 86600 WHERE id = 'AZ'; -- Azerbaijan
UPDATE countries SET area_km2 = 92090 WHERE id = 'PT'; -- Portugal
UPDATE countries SET area_km2 = 78867 WHERE id = 'CZ'; -- Czech Republic
UPDATE countries SET area_km2 = 131957 WHERE id = 'GR'; -- Greece
UPDATE countries SET area_km2 = 48671 WHERE id = 'DO'; -- Dominican Republic
UPDATE countries SET area_km2 = 109884 WHERE id = 'CU'; -- Cuba
UPDATE countries SET area_km2 = 27750 WHERE id = 'HT'; -- Haiti
UPDATE countries SET area_km2 = 30528 WHERE id = 'BE'; -- Belgium
UPDATE countries SET area_km2 = 1098581 WHERE id = 'BO'; -- Bolivia
UPDATE countries SET area_km2 = 163610 WHERE id = 'TN'; -- Tunisia
UPDATE countries SET area_km2 = 274200 WHERE id = 'BF'; -- Burkina Faso
UPDATE countries SET area_km2 = 637657 WHERE id = 'SO'; -- Somalia
UPDATE countries SET area_km2 = 196722 WHERE id = 'SN'; -- Senegal
UPDATE countries SET area_km2 = 1284000 WHERE id = 'TD'; -- Chad
UPDATE countries SET area_km2 = 390757 WHERE id = 'ZW'; -- Zimbabwe
UPDATE countries SET area_km2 = 245857 WHERE id = 'GN'; -- Guinea
UPDATE countries SET area_km2 = 26338 WHERE id = 'RW'; -- Rwanda
UPDATE countries SET area_km2 = 112622 WHERE id = 'BJ'; -- Benin
UPDATE countries SET area_km2 = 27830 WHERE id = 'BI'; -- Burundi
UPDATE countries SET area_km2 = 644329 WHERE id = 'SS'; -- South Sudan
UPDATE countries SET area_km2 = 41850 WHERE id = 'NL'; -- Netherlands
UPDATE countries SET area_km2 = 2724900 WHERE id = 'KZ'; -- Kazakhstan
UPDATE countries SET area_km2 = 108889 WHERE id = 'GT'; -- Guatemala
UPDATE countries SET area_km2 = 283561 WHERE id = 'EC'; -- Ecuador
UPDATE countries SET area_km2 = 185180 WHERE id = 'SY'; -- Syria
UPDATE countries SET area_km2 = 1240192 WHERE id = 'ML'; -- Mali
UPDATE countries SET area_km2 = 118484 WHERE id = 'MW'; -- Malawi
UPDATE countries SET area_km2 = 756096 WHERE id = 'CL'; -- Chile
UPDATE countries SET area_km2 = 752618 WHERE id = 'ZM'; -- Zambia
UPDATE countries SET area_km2 = 1267000 WHERE id = 'NE'; -- Niger
UPDATE countries SET area_km2 = 65610 WHERE id = 'LK'; -- Sri Lanka
UPDATE countries SET area_km2 = 238391 WHERE id = 'RO'; -- Romania
UPDATE countries SET area_km2 = 801590 WHERE id = 'MZ'; -- Mozambique
UPDATE countries SET area_km2 = 587041 WHERE id = 'MG'; -- Madagascar
UPDATE countries SET area_km2 = 475442 WHERE id = 'CM'; -- Cameroon
UPDATE countries SET area_km2 = 322463 WHERE id = 'CI'; -- Ivory Coast
UPDATE countries SET area_km2 = 7692024 WHERE id = 'AU'; -- Australia
UPDATE countries SET area_km2 = 36193 WHERE id = 'TW'; -- Taiwan
UPDATE countries SET area_km2 = 916445 WHERE id = 'VE'; -- Venezuela
UPDATE countries SET area_km2 = 147181 WHERE id = 'NP'; -- Nepal
UPDATE countries SET area_km2 = 447400 WHERE id = 'UZ'; -- Uzbekistan
UPDATE countries SET area_km2 = 1285216 WHERE id = 'PE'; -- Peru
UPDATE countries SET area_km2 = 329847 WHERE id = 'MY'; -- Malaysia
UPDATE countries SET area_km2 = 652230 WHERE id = 'AF'; -- Afghanistan
UPDATE countries SET area_km2 = 2149690 WHERE id = 'SA'; -- Saudi Arabia
UPDATE countries SET area_km2 = 241038 WHERE id = 'UG'; -- Uganda
UPDATE countries SET area_km2 = 438317 WHERE id = 'IQ'; -- Iraq
UPDATE countries SET area_km2 = 9984670 WHERE id = 'CA'; -- Canada
UPDATE countries SET area_km2 = 312696 WHERE id = 'PL'; -- Poland
UPDATE countries SET area_km2 = 446550 WHERE id = 'MA'; -- Morocco
UPDATE countries SET area_km2 = 2381741 WHERE id = 'DZ'; -- Algeria
UPDATE countries SET area_km2 = 2780400 WHERE id = 'AR'; -- Argentina
UPDATE countries SET area_km2 = 1861484 WHERE id = 'SD'; -- Sudan
UPDATE countries SET area_km2 = 603550 WHERE id = 'UA'; -- Ukraine
UPDATE countries SET area_km2 = 580367 WHERE id = 'KE'; -- Kenya
UPDATE countries SET area_km2 = 505992 WHERE id = 'ES'; -- Spain
UPDATE countries SET area_km2 = 947300 WHERE id = 'TZ'; -- Tanzania
UPDATE countries SET area_km2 = 1221037 WHERE id = 'ZA'; -- South Africa
UPDATE countries SET area_km2 = 676578 WHERE id = 'MM'; -- Myanmar
UPDATE countries SET area_km2 = 100210 WHERE id = 'KR'; -- South Korea
UPDATE countries SET area_km2 = 1141748 WHERE id = 'CO'; -- Colombia
UPDATE countries SET area_km2 = 301340 WHERE id = 'IT'; -- Italy
UPDATE countries SET area_km2 = 243610 WHERE id = 'GB'; -- United Kingdom
UPDATE countries SET area_km2 = 643801 WHERE id = 'FR'; -- France
UPDATE countries SET area_km2 = 513120 WHERE id = 'TH'; -- Thailand
UPDATE countries SET area_km2 = 357114 WHERE id = 'DE'; -- Germany
UPDATE countries SET area_km2 = 783562 WHERE id = 'TR'; -- Turkey
UPDATE countries SET area_km2 = 1648195 WHERE id = 'IR'; -- Iran
UPDATE countries SET area_km2 = 2344858 WHERE id = 'CD'; -- Democratic Republic of Congo
UPDATE countries SET area_km2 = 331212 WHERE id = 'VN'; -- Vietnam
UPDATE countries SET area_km2 = 300000 WHERE id = 'PH'; -- Philippines
UPDATE countries SET area_km2 = 1104300 WHERE id = 'ET'; -- Ethiopia
UPDATE countries SET area_km2 = 1001449 WHERE id = 'EG'; -- Egypt
UPDATE countries SET area_km2 = 377975 WHERE id = 'JP'; -- Japan
UPDATE countries SET area_km2 = 1964375 WHERE id = 'MX'; -- Mexico
UPDATE countries SET area_km2 = 17098242 WHERE id = 'RU'; -- Russia
UPDATE countries SET area_km2 = 148460 WHERE id = 'BD'; -- Bangladesh
UPDATE countries SET area_km2 = 923768 WHERE id = 'NG'; -- Nigeria
UPDATE countries SET area_km2 = 8514877 WHERE id = 'BR'; -- Brazil
UPDATE countries SET area_km2 = 881913 WHERE id = 'PK'; -- Pakistan
UPDATE countries SET area_km2 = 1904569 WHERE id = 'ID'; -- Indonesia
UPDATE countries SET area_km2 = 9833517 WHERE id = 'US'; -- United States
UPDATE countries SET area_km2 = 3287263 WHERE id = 'IN'; -- India
UPDATE countries SET area_km2 = 9596960 WHERE id = 'CN'; -- China
