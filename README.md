# Chakra-ui Calendar

This is a single-file ui components that you can copy into your `/src/components/ui` folder and use it as a snippet downloaded by the `@chakra-ui/cli`.

The file is found [here](https://github.com/fmiccolis/chakra-ui-calendar/blob/main/src/components/ui/calendar.tsx) BUT I strongly recommend to look into it before copying.  
The Calendar is powered by [momentjs](https://momentjs.com/) so you have to install the dependency in order to use it.  
If you want to use your own preferred date library you have to edit the file.  

Once copied in your project, the file could be splitted in at least three parts (based on your project structure):
- The component itself: containing only the react `Calendar` Component
- The types: Including `CalendarProps`, `CalendarView` and `IntRange`
- The utils functions: Including `groupBy` (a masterpiece on its own found [here](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBMCGAnCMC8MDaBvAsAKBkLiQC4YByAQQFcATAS3IBp8iYBbEWgUwBsyqANmasi0AJ69uAgMrda8MCIJFx3UhQBMABm0BWZQF8WeXHlGEEiATQbK2nHvwqUALPbFRJ0inIVKTNjUNch0ARgAOIxMzC2JrCgAVEHEQKHgPQkc+AQBhEEQQXgzAz29ZeUVMmGCE0N1hE2N8WJVLEOTU9Ors53Jc+HZEcWqJKQr-atqBHW1G-Ga8AF18VbxQSFgAc0LqAAcAIXE0GAAeRJhuAA8objBaFAAlblBEWlOAaSYYLEMAPm+H0uNzuDxgAGtuKkAGYwRJ-AAUcRAACMAFaURAJRDqWjgXjHRIYJalQh7Qp7biILxkL74ACUaD+MFRGKxADocbRqMBuAiEexuJxvldGahmWY2PRYQirhhySBKdTxEtGZK2EQNtAYAA3eC8ajcE6y+UUqleVXsqAgGRQRD0MBbBH0gDccSlMoAhILOBg9QbuKqfu6NVkhSA-frDUsTsS3W0NYYQ2Hff7o+y9tQIAALWWuuJJhM4qDURBgDjh+PGH6GGDwJ4vArvaD2x3fIlLP758w9ryUmAAcV2h3EAFlqLwoPRzoDgbd7igcfA8WACXWwOJiczUHEgdd52Clyu1xhFOJvuzLw7oVSYB9HjGAPxxZ6vZt2h1bb5DkD7I7jydp0SQFHj+ZkyCPfFCTjNYtW2Yd-wnKcTlOOILn3UEGzfT4MDAah2BRKkSRrAFdznTCYEg1djgRSEYTheliXwREkGxXEoLhYlvjoiAIPY6jMEvdkPmIhU9gASXua4Tm0MUJTiPVEBgHZfz2SlaAAeXRMgzxOFS-3EBFWO4qEIFNRVJJ4K5VXjNgtLRF4oHZHiEX0tT5Hs+l2WhAoAFF4GAXNaKhOTgwTD0YARMTLOk04IVM9kpEdKBsxgABaGAwjVZMNTc9T7IwOiY3QNzEMA04z2+M8tyRcLQ1y4d8vRQqoWInjvmiqSrhgABqTLu3qmBaz4CAjXVQbCDyjzmqKvTGumtEWpVHLCzYQwBqIYtS3LKbNPROsUB-AyAKnGc7z+Ks1nwODKO4CAkLm1SyqnBErAgb4MHIKxmAoWofvIXpyBs-AAHoACo4HAbUcXuycyFfJtThbT9vgRt4kY-NsYDR99Wy-W7lw48b4jIZHHVsohelJzGtgpwgxh8MnabiaYYCZqstzAmAwZBtZ7Mc5zTIRGGkK8nzEH8wLaKZOJ+eAJyXJFydCstcXJdzXgZbqwg5YVoWlagFWMF4VW-IC3N2CZMKJs2u6kKNk2MHYJZvLNqXgCtrUim4RKQCdYB2SsekNtDda4npBlrqh73fadAApGQNIAOXZJnpUMg36W+PDeF4b5NG7NYgA)) and `convert`

## Live demo

Live demo can be found at [https://chakra-ui-calendar.vercel.app/](https://chakra-ui-calendar.vercel.app/).  
Take a look to see how it works!

### Localization

The component was initially branched from one of my project in Italian.  
The order in the weekdays initially was with Monday first and to do so I had to use `isoWeek` instead of `week` when creating the `firstMonday` and `lastSunday` variables (that's why are called in taht way even though in the live demo the first day that you see is a Sunday and the last a Saturady).  
If you plan to change the locale (UNDER CONSTRUCTION!!)
