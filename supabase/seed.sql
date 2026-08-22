-- Seed data for TKEP2.0 (World Wipe)
-- Applied automatically by `supabase db reset` / `supabase start` after migrations.
-- Idempotent: safe to re-run.

-- 164 countries, ordered by population (smallest first) via order_index.
INSERT INTO countries (id, name, initial_population, current_population, order_index) VALUES
('VA', 'Vatican City', 800, 800, 1),
('NR', 'Nauru', 12000, 12000, 2),
('TV', 'Tuvalu', 12000, 12000, 3),
('SM', 'San Marino', 34000, 34000, 4),
('LI', 'Liechtenstein', 39000, 39000, 5),
('MC', 'Monaco', 39000, 39000, 6),
('MH', 'Marshall Islands', 42000, 42000, 7),
('AD', 'Andorra', 79000, 79000, 8),
('KN', 'Saint Kitts and Nevis', 53000, 53000, 9),
('DM', 'Dominica', 72000, 72000, 10),
('AG', 'Antigua and Barbuda', 99000, 99000, 11),
('SC', 'Seychelles', 99000, 99000, 12),
('VC', 'Saint Vincent and the Grenadines', 111000, 111000, 13),
('GD', 'Grenada', 113000, 113000, 14),
('TO', 'Tonga', 106000, 106000, 15),
('FM', 'Micronesia', 115000, 115000, 16),
('KI', 'Kiribati', 121000, 121000, 17),
('LC', 'Saint Lucia', 184000, 184000, 18),
('WS', 'Samoa', 200000, 200000, 19),
('ST', 'Sao Tome and Principe', 223000, 223000, 20),
('VU', 'Vanuatu', 320000, 320000, 21),
('BB', 'Barbados', 288000, 288000, 22),
('IS', 'Iceland', 372000, 372000, 23),
('MT', 'Malta', 519000, 519000, 24),
('BN', 'Brunei', 449000, 449000, 25),
('BH', 'Bahrain', 1748000, 1748000, 26),
('CY', 'Cyprus', 1215000, 1215000, 27),
('DJ', 'Djibouti', 1000000, 1000000, 28),
('FJ', 'Fiji', 924000, 924000, 29),
('BT', 'Bhutan', 777000, 777000, 30),
('KM', 'Comoros', 888000, 888000, 31),
('GQ', 'Equatorial Guinea', 1449000, 1449000, 32),
('EE', 'Estonia', 1331000, 1331000, 33),
('MU', 'Mauritius', 1274000, 1274000, 34),
('SZ', 'Eswatini', 1172000, 1172000, 35),
('TT', 'Trinidad and Tobago', 1403000, 1403000, 36),
('GW', 'Guinea-Bissau', 2015000, 2015000, 37),
('LV', 'Latvia', 1884000, 1884000, 38),
('SI', 'Slovenia', 2108000, 2108000, 39),
('MK', 'North Macedonia', 2083000, 2083000, 40),
('LS', 'Lesotho', 2159000, 2159000, 41),
('BW', 'Botswana', 2397000, 2397000, 42),
('GM', 'Gambia', 2417000, 2417000, 43),
('QA', 'Qatar', 2881000, 2881000, 44),
('LT', 'Lithuania', 2718000, 2718000, 45),
('AL', 'Albania', 2838000, 2838000, 46),
('JM', 'Jamaica', 2973000, 2973000, 47),
('MN', 'Mongolia', 3329000, 3329000, 48),
('AM', 'Armenia', 2963000, 2963000, 49),
('UY', 'Uruguay', 3487000, 3487000, 50),
('GE', 'Georgia', 3708000, 3708000, 51),
('BA', 'Bosnia and Herzegovina', 3281000, 3281000, 52),
('MD', 'Moldova', 2618000, 2618000, 53),
('KW', 'Kuwait', 4271000, 4271000, 54),
('HR', 'Croatia', 3888000, 3888000, 55),
('OM', 'Oman', 5107000, 5107000, 56),
('LB', 'Lebanon', 6825000, 6825000, 57),
('SG', 'Singapore', 5918000, 5918000, 58),
('FI', 'Finland', 5541000, 5541000, 59),
('SK', 'Slovakia', 5460000, 5460000, 60),
('NO', 'Norway', 5457000, 5457000, 61),
('IE', 'Ireland', 5028000, 5028000, 62),
('CR', 'Costa Rica', 5094000, 5094000, 63),
('NZ', 'New Zealand', 5185000, 5185000, 64),
('LR', 'Liberia', 5058000, 5058000, 65),
('CF', 'Central African Republic', 4830000, 4830000, 66),
('PA', 'Panama', 4315000, 4315000, 67),
('MR', 'Mauritania', 4650000, 4650000, 68),
('DK', 'Denmark', 5831000, 5831000, 69),
('TM', 'Turkmenistan', 6031000, 6031000, 70),
('SL', 'Sierra Leone', 8421000, 8421000, 71),
('TG', 'Togo', 8279000, 8279000, 72),
('CH', 'Switzerland', 8703000, 8703000, 73),
('HN', 'Honduras', 10063000, 10063000, 74),
('AE', 'United Arab Emirates', 9890000, 9890000, 75),
('AT', 'Austria', 9006000, 9006000, 76),
('BY', 'Belarus', 9449000, 9449000, 77),
('TJ', 'Tajikistan', 9750000, 9750000, 78),
('HU', 'Hungary', 9660000, 9660000, 79),
('JO', 'Jordan', 10203000, 10203000, 80),
('AZ', 'Azerbaijan', 10140000, 10140000, 81),
('PT', 'Portugal', 10196000, 10196000, 82),
('CZ', 'Czech Republic', 10709000, 10709000, 83),
('GR', 'Greece', 10423000, 10423000, 84),
('DO', 'Dominican Republic', 10848000, 10848000, 85),
('CU', 'Cuba', 11327000, 11327000, 86),
('HT', 'Haiti', 11403000, 11403000, 87),
('BE', 'Belgium', 11590000, 11590000, 88),
('BO', 'Bolivia', 11673000, 11673000, 89),
('TN', 'Tunisia', 11819000, 11819000, 90),
('BF', 'Burkina Faso', 22673000, 22673000, 91),
('SO', 'Somalia', 15893000, 15893000, 92),
('SN', 'Senegal', 16744000, 16744000, 93),
('TD', 'Chad', 16425000, 16425000, 94),
('ZW', 'Zimbabwe', 14863000, 14863000, 95),
('GN', 'Guinea', 13133000, 13133000, 96),
('RW', 'Rwanda', 12952000, 12952000, 97),
('BJ', 'Benin', 12123000, 12123000, 98),
('BI', 'Burundi', 11890000, 11890000, 99),
('SS', 'South Sudan', 11194000, 11194000, 100),
('NL', 'Netherlands', 17135000, 17135000, 101),
('KZ', 'Kazakhstan', 19398000, 19398000, 102),
('GT', 'Guatemala', 16859000, 16859000, 103),
('EC', 'Ecuador', 17644000, 17644000, 104),
('SY', 'Syria', 17501000, 17501000, 105),
('ML', 'Mali', 20251000, 20251000, 106),
('MW', 'Malawi', 19130000, 19130000, 107),
('CL', 'Chile', 19116000, 19116000, 108),
('ZM', 'Zambia', 18384000, 18384000, 109),
('NE', 'Niger', 24207000, 24207000, 110),
('LK', 'Sri Lanka', 21413000, 21413000, 111),
('RO', 'Romania', 19238000, 19238000, 112),
('MZ', 'Mozambique', 31255000, 31255000, 113),
('MG', 'Madagascar', 27691000, 27691000, 114),
('CM', 'Cameroon', 26546000, 26546000, 115),
('CI', 'Ivory Coast', 26378000, 26378000, 116),
('AU', 'Australia', 25500000, 25500000, 117),
('TW', 'Taiwan', 23816000, 23816000, 118),
('VE', 'Venezuela', 28436000, 28436000, 119),
('NP', 'Nepal', 29137000, 29137000, 120),
('UZ', 'Uzbekistan', 34233000, 34233000, 121),
('PE', 'Peru', 32972000, 32972000, 122),
('MY', 'Malaysia', 32366000, 32366000, 123),
('AF', 'Afghanistan', 38928000, 38928000, 124),
('SA', 'Saudi Arabia', 34814000, 34814000, 125),
('UG', 'Uganda', 45741000, 45741000, 126),
('IQ', 'Iraq', 40223000, 40223000, 127),
('CA', 'Canada', 38037000, 38037000, 128),
('PL', 'Poland', 37847000, 37847000, 129),
('MA', 'Morocco', 36910000, 36910000, 130),
('DZ', 'Algeria', 43851000, 43851000, 131),
('AR', 'Argentina', 45196000, 45196000, 132),
('SD', 'Sudan', 43849000, 43849000, 133),
('UA', 'Ukraine', 43734000, 43734000, 134),
('KE', 'Kenya', 53771000, 53771000, 135),
('ES', 'Spain', 46755000, 46755000, 136),
('TZ', 'Tanzania', 59734000, 59734000, 137),
('ZA', 'South Africa', 59309000, 59309000, 138),
('MM', 'Myanmar', 54410000, 54410000, 139),
('KR', 'South Korea', 51269000, 51269000, 140),
('CO', 'Colombia', 50883000, 50883000, 141),
('IT', 'Italy', 60462000, 60462000, 142),
('GB', 'United Kingdom', 67886000, 67886000, 143),
('FR', 'France', 65274000, 65274000, 144),
('TH', 'Thailand', 69800000, 69800000, 145),
('DE', 'Germany', 83784000, 83784000, 146),
('TR', 'Turkey', 84339000, 84339000, 147),
('IR', 'Iran', 83993000, 83993000, 148),
('CD', 'Democratic Republic of Congo', 89561000, 89561000, 149),
('VN', 'Vietnam', 97339000, 97339000, 150),
('PH', 'Philippines', 109581000, 109581000, 151),
('ET', 'Ethiopia', 115000000, 115000000, 152),
('EG', 'Egypt', 102334000, 102334000, 153),
('JP', 'Japan', 125800000, 125800000, 154),
('MX', 'Mexico', 128933000, 128933000, 155),
('RU', 'Russia', 145934000, 145934000, 156),
('BD', 'Bangladesh', 164689000, 164689000, 157),
('NG', 'Nigeria', 218541000, 218541000, 158),
('BR', 'Brazil', 215313000, 215313000, 159),
('PK', 'Pakistan', 220892000, 220892000, 160),
('ID', 'Indonesia', 273524000, 273524000, 161),
('US', 'United States', 331003000, 331003000, 162),
('IN', 'India', 1380004000, 1380004000, 163),
('CN', 'China', 1439324000, 1439324000, 164)
ON CONFLICT (id) DO UPDATE SET
    name               = EXCLUDED.name,
    initial_population = EXCLUDED.initial_population,
    order_index        = EXCLUDED.order_index;

-- Land areas (km2).
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

-- Initialise / recompute the single global_stats row.
INSERT INTO global_stats (id, total_world_clicks, total_world_population, countries_cleared)
VALUES (1, 0, (SELECT COALESCE(SUM(initial_population), 0) FROM countries), 0)
ON CONFLICT (id) DO UPDATE SET
    total_world_population = (SELECT COALESCE(SUM(initial_population), 0) FROM countries);
