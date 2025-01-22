import { type ChangeEventHandler, Fragment, useCallback, useContext, useMemo, useState } from 'react';
import { TabsContext } from '../../context/TabsProvider';
import { Box, Divider } from '@mui/material';
import { SearchTabsBox } from './SearchTabsBox';
import { AppDataContext } from '../../context/AppDataProvider';
import { getUrl, tabGroupFns } from '../../../utils';
import { PageStateContext } from '../../context/PageStateProvider';
import TabManagerListItem from './TabManagerListItem';
import { BasicList } from '../../components/BasicList';

export const TabManager = () => {
    const appData = useContext(AppDataContext);
    const tabs = useContext(TabsContext);
    const pageStates = useContext(PageStateContext);

    const [inputText, setInputText] = useState('');

    const groupedTabs = useMemo(() => {
        console.log(pageStates);

        const groupedTabList = Object.entries(tabGroupFns[appData.manageTabsGroupBy](tabs));

        switch (appData.manageTabsGroupBy) {
            default:
            case 'Window':
                break;
            case 'Domain':
                groupedTabList.sort(([a], [b]) => {
                    const [urlA, urlB] = [a, b].map((compound) => getUrl(compound.split('\\').shift()!));
                    if (!urlA || !urlB) return urlA === urlB ? 0 : !urlB ? -1 : 1;

                    return urlA.host.localeCompare(urlB.host);
                });
        }

        // Prioritize group order by capturing video/audio
        groupedTabList.sort(([, tabsA], [, tabsB]) => {
            const [scoreA, scoreB] = [tabsA, tabsB].map((tabs) =>
                tabs.reduce((acc, tab) => {
                    const pageState = pageStates[tab.id!];
                    if (pageState?.video) acc++;
                    if (pageState?.audio) acc++;
                    return acc;
                }, 0)
            );

            if (scoreA === scoreB) return 0;
            return scoreA > scoreB ? -1 : 1;
        });

        // Within each tab group, prioritize order by:
        // Capturing video/audio
        // Playing audio
        groupedTabList.forEach(([, tabs]) =>
            tabs.sort((a, b) => {
                const pageStateA = pageStates[a.id!];
                const pageStateB = pageStates[b.id!];

                if (Boolean(pageStateA?.video) !== Boolean(pageStateB?.video)) return pageStateA?.video ? -1 : 1;
                if (Boolean(pageStateA?.audio) !== Boolean(pageStateB?.audio)) return pageStateA?.audio ? -1 : 1;
                if (Boolean(a.audible && !a.mutedInfo?.muted) !== Boolean(b.audible && !b.mutedInfo?.muted))
                    return a.audible && !a.mutedInfo?.muted ? -1 : 1;
                return 0;
            })
        );

        return groupedTabList;
    }, [tabs, appData.manageTabsGroupBy, pageStates]);

    const filteredGroupedTabs = useMemo(() => {
        const sanitizedInput = inputText.trim().toLocaleLowerCase();
        if (!sanitizedInput) return groupedTabs;

        return groupedTabs.reduce<[string, chrome.tabs.Tab[]][]>((acc, [title, tabs]) => {
            const filteredTabs = tabs.filter((tab) =>
                [tab.url?.toLocaleLowerCase(), tab.title?.toLocaleLowerCase()].some((val) => val?.includes(sanitizedInput))
            );

            if (filteredTabs.length) {
                acc.push([title, filteredTabs]);
            }

            return acc;
        }, []);
    }, [groupedTabs, inputText]);

    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
        (e) => setInputText(e.target.value),
        []
    );

    return (
        <Box display='flex' flexDirection='column'>
            <SearchTabsBox value={inputText} onChange={handleInputChange} />

            <BasicList>
                {/* <Suspense fallback={null}> */}
                {filteredGroupedTabs.map(([groupTitle, groupTabs], i) => {
                    const [title, key] = groupTitle.split('\\');

                    return (
                        <Fragment key={`tab-group-${key}`}>
                            {i !== 0 && <Divider />}

                            <TabManagerListItem title={title} tabs={groupTabs} groupType={appData.manageTabsGroupBy} />
                        </Fragment>
                    );
                })}
                {/* </Suspense> */}
            </BasicList>
        </Box>
    );
};
