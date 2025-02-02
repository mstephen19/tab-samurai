import { memo, type MouseEventHandler, type SyntheticEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccordionDetails, Box, Chip, IconButton, MenuItem, styled, Tooltip, type SvgIconProps } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import { toast } from '../../Toast';
import { Favicon } from '../../components/DomainFavicon';
import { pluralize } from '../../../utils';
import { HoverMenu } from '../../components/HoverMenu';
import { AppData } from '../../../types';
import { PageStateContext } from '../../context/PageStateProvider';
import { BasicList, BasicListItem, BasicListItemText } from '../../components/BasicList';
import { EllipsesTypography } from '../../components/EllipsesTypography';
import { BasicAccordion, BasicAccordionSummary } from '../../components/BasicAccordion';
import { OPENED_IN_POPOUT } from '../../consts';

const Dot = styled(Box)({
    width: '0.5rem',
    flex: '0.5rem 0 0',
    height: '0.5rem',
    borderRadius: '50%',
});

const VOLUME_ICONS = [VolumeDownIcon, VolumeUpIcon];

const AnimatedVolumeIcon = memo(({ interval = 1_000, ...rest }: { interval?: number } & SvgIconProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const handler = () => {
            setIndex((prev) => (prev >= VOLUME_ICONS.length - 1 ? 0 : prev + 1));
            timeout = setTimeout(handler, 1_000);
        };

        timeout = setTimeout(handler, 1_000);

        return () => clearTimeout(timeout);
    }, [interval]);

    const Component = VOLUME_ICONS[index];

    return <Component {...rest} />;
});

const TabListItem = memo(
    ({
        id,
        title,
        favIconUrl,
        url,
        active,
        audible,
        discarded,
        pinned,
        muted,
        windowId,
    }: Pick<chrome.tabs.Tab, 'id' | 'title' | 'favIconUrl' | 'url' | 'active' | 'audible' | 'discarded' | 'pinned' | 'windowId'> & {
        muted: boolean;
    }) => {
        const pageStates = useContext(PageStateContext);

        const capturingVideo = Boolean(pageStates[id!]?.video);
        const capturingAudio = Boolean(pageStates[id!]?.audio);

        const [anchor, setAnchor] = useState<HTMLElement | null>();
        const open = Boolean(anchor);

        const handleOpenMenu: MouseEventHandler<HTMLElement> = useCallback((e) => setAnchor(e.currentTarget), []);
        const handleCloseMenu = useCallback(() => setAnchor(null), []);

        const handleUrlClick = useCallback(async () => {
            const lastFocusedWindow = await chrome.windows.getLastFocused();
            if (lastFocusedWindow.id !== windowId) chrome.windows.update(windowId, { focused: true });

            chrome.tabs.update(id!, { active: true });
        }, [id, windowId]);

        const handleCloseTab = useCallback(async () => {
            try {
                await chrome.tabs.remove(id!);
            } catch {
                toast({
                    type: 'error',
                    message: 'Failed to close tab.',
                });
            }

            handleCloseMenu();
        }, [id, handleCloseMenu]);

        const handleMuteTab = useCallback(
            async (shouldMute: boolean) => {
                try {
                    await chrome.tabs.update(id!, { muted: shouldMute });
                } catch {
                    toast({
                        type: 'error',
                        message: `Failed to ${shouldMute ? 'mute' : 'unmute'} tab.`,
                    });
                }

                handleCloseMenu();
            },
            [id, handleCloseMenu]
        );

        const handleSuspendTab = useCallback(async () => {
            try {
                await chrome.tabs.discard(id!);
            } catch {
                toast({
                    type: 'error',
                    message: 'Failed to hibernate tab.',
                });
            }

            handleCloseMenu();
        }, [id, handleCloseMenu]);

        const handlePinTab = useCallback(
            async (shouldPin: boolean) => {
                try {
                    await chrome.tabs.update(id!, { pinned: shouldPin });
                } catch {
                    toast({
                        type: 'error',
                        message: `Failed to ${shouldPin ? 'pin' : 'unpin'} tab.`,
                    });
                }

                handleCloseMenu();
            },
            [id, handleCloseMenu]
        );

        return (
            <BasicListItem>
                <Tooltip title={active ? 'Currently Active' : discarded ? 'Hibernating' : 'Inactive'} arrow placement='top'>
                    <Dot sx={{ background: active ? 'lightgreen' : discarded ? 'lightsalmon' : 'lightgrey' }} />
                </Tooltip>

                <Favicon url={favIconUrl} />

                <BasicListItemText
                    primary={
                        <Box display='flex' alignItems='center' gap='5px'>
                            <EllipsesTypography
                                sx={{
                                    fontSize: 'inherit',
                                    color: 'inherit',
                                }}>
                                {title}
                            </EllipsesTypography>

                            {muted && <VolumeOffIcon sx={{ fontSize: '1rem' }} />}
                            {Boolean(audible) && !muted && <AnimatedVolumeIcon sx={{ fontSize: '1rem' }} />}

                            {capturingVideo && <VideocamIcon sx={{ fontSize: '1rem' }} />}

                            {capturingAudio && <MicIcon sx={{ fontSize: '1rem' }} />}
                        </Box>
                    }
                    secondary={url}
                    slotProps={{
                        secondary: {
                            onClick: handleUrlClick,
                        },
                        primary: {
                            onClick: handleUrlClick,
                        },
                    }}
                />

                <Tooltip title='Tab Options' placement='left' arrow>
                    <IconButton onClick={handleOpenMenu}>
                        <MoreVertIcon />
                    </IconButton>
                </Tooltip>

                <HoverMenu anchorEl={anchor} open={open} onClose={handleCloseMenu}>
                    <MenuItem disabled={!OPENED_IN_POPOUT && active} onClick={handleCloseTab} disableRipple>
                        <CancelIcon />
                        Close
                    </MenuItem>

                    <MenuItem onClick={() => handleMuteTab(!muted)} disableRipple>
                        {muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                        {muted ? 'Unmute' : 'Mute'}
                    </MenuItem>

                    <MenuItem disabled={discarded || active} onClick={handleSuspendTab} disableRipple>
                        <BedtimeIcon />
                        Hibernate
                    </MenuItem>

                    <MenuItem onClick={() => handlePinTab(!pinned)} disableRipple>
                        <PushPinIcon />
                        {pinned ? 'Unpin' : 'Pin'}
                    </MenuItem>
                </HoverMenu>
            </BasicListItem>
        );
    }
);

const getScrollableParent = (elem: HTMLElement) => {
    for (let parent = elem.parentElement; parent !== null; parent = parent.parentElement ?? null) {
        const style = getComputedStyle(parent);
        if (style.overflowY === 'scroll' && parent.scrollHeight) return parent;
    }

    return parent;
};

const TabGroupListItem = ({
    title,
    tabs,
    groupType,
}: {
    title: string;
    tabs: chrome.tabs.Tab[];
    groupType: AppData['manageTabsGroupBy'];
}) => {
    const accordionRef = useRef<HTMLDivElement>(null);

    const [accordionOpen, setAccordionOpen] = useState(false);
    const handleAccordionChange = useCallback((_: SyntheticEvent, expanded: boolean) => setAccordionOpen(expanded), []);

    const pageStates = useContext(PageStateContext);

    const someTabsCapturingAudio = tabs.some(({ id }) => pageStates[id!]?.audio);
    const someTabsCapturingVideo = tabs.some(({ id }) => pageStates[id!]?.video);

    const favIconUrl = useMemo(() => tabs.find((tab) => Boolean(tab.favIconUrl))?.favIconUrl, [tabs]);

    const [anchor, setAnchor] = useState<HTMLElement | null>();
    const open = Boolean(anchor);

    const handleOpenMenu: MouseEventHandler<HTMLElement> = useCallback((e) => setAnchor(e.currentTarget), []);
    const handleCloseMenu = useCallback(() => setAnchor(null), []);

    const handleMoveAllToWindow = useCallback(async () => {
        operation: try {
            const currentWindowTabs = await chrome.tabs.query({ windowId: tabs[0].windowId });

            const currentWindowTabIds = currentWindowTabs.map(({ id }) => id!);

            // If all the tabs in the group are already in the same window and they are the only tabs in that window
            if (currentWindowTabIds.length === tabs.length && tabs.every(({ id }) => currentWindowTabIds.includes(id!))) {
                toast({
                    type: 'warning',
                    message: 'All tabs in this group are already in their own window.',
                });
                break operation;
            }

            const newWindow = await chrome.windows.create({
                tabId: tabs[0].id!,
                focused: true,
            });

            await chrome.tabs.move(
                tabs.slice(1).map(({ id }) => id!),
                { index: -1, windowId: newWindow.id! }
            );
        } catch {
            toast({
                type: 'error',
                message: 'Failed to move tabs to new window.',
            });
        }

        handleCloseMenu();
    }, [tabs, handleCloseMenu]);

    const handleCloseTabs = useCallback(async () => {
        try {
            const lastFocusedWindow = await chrome.windows.getLastFocused();
            const tabGroupWindowId = groupType === 'Window' ? tabs.find(({ windowId }) => windowId)?.windowId : null;

            // Close whole window if grouping by window, and the target window isn't the currently active window
            if (tabGroupWindowId && lastFocusedWindow.id !== tabGroupWindowId) {
                await chrome.windows.remove(tabGroupWindowId);

                toast({
                    type: 'success',
                    message: `Closed window with ${tabs.length} ${pluralize(tabs.length, 'tab', 'tabs')}`,
                });
                return;
            }

            const tabsToClose =
                // Allow closing active tabs if the panel is opened in the popout
                // ? Otherwise, closing the active tab closes the popup
                OPENED_IN_POPOUT ? tabs : tabs.filter(({ active }) => !active);

            await chrome.tabs.remove(tabsToClose.map(({ id }) => id!));

            toast({
                type: 'success',
                message: `Closed ${tabsToClose.length} ${pluralize(tabsToClose.length, 'tab', 'tabs')}`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to close tabs.',
            });
        }

        handleCloseMenu();
    }, [groupType, tabs, handleCloseMenu]);

    const hasUnmutedAudibleTab = tabs.some(({ audible, mutedInfo }) => audible && !mutedInfo?.muted);

    const someTabsMuted = tabs.some(({ mutedInfo }) => mutedInfo?.muted);
    const allTabsMuted = tabs.every(({ mutedInfo }) => mutedInfo?.muted);

    const handleMuteTabs = useCallback(
        async (shouldMute: boolean) => {
            try {
                const tabsToMute = tabs.filter(({ mutedInfo }) => (shouldMute ? !mutedInfo?.muted : mutedInfo?.muted));

                await Promise.all(tabsToMute.map(({ id }) => chrome.tabs.update(id!, { muted: shouldMute })));

                toast({
                    type: 'success',
                    message: `${shouldMute ? 'Muted' : 'Unmuted'} ${tabsToMute.length} ${pluralize(tabsToMute.length, 'tab', 'tabs')}`,
                });
            } catch {
                toast({
                    type: 'error',
                    message: `Failed to ${shouldMute ? 'mute' : 'unmute'} tabs.`,
                });
            }

            handleCloseMenu();
        },
        [tabs, handleCloseMenu]
    );

    const allTabsDiscardedOrActive = tabs.every(({ discarded, active }) => discarded || active);

    const handleSuspendTabs = useCallback(async () => {
        try {
            const tabsToSuspend = tabs.filter(({ active, discarded }) => !active && !discarded);

            await Promise.all(tabsToSuspend.map(({ id }) => chrome.tabs.discard(id!)));

            toast({
                type: 'success',
                message: `Hibernated ${tabsToSuspend.length} ${pluralize(tabsToSuspend.length, 'tab', 'tabs')}`,
            });
        } catch {
            toast({
                type: 'error',
                message: 'Failed to hibernate tabs.',
            });
        }

        handleCloseMenu();
    }, [tabs, handleCloseMenu]);

    const someTabsPinned = tabs.some(({ pinned }) => pinned);

    const handlePinTabs = useCallback(
        async (shouldPin: boolean) => {
            try {
                const tabsToPin = tabs.filter(({ pinned }) => (shouldPin ? !pinned : pinned));

                await Promise.all(tabsToPin.map(({ id }) => chrome.tabs.update(id!, { pinned: shouldPin })));

                toast({
                    type: 'success',
                    message: `${shouldPin ? 'Pinned' : 'Unpinned'} ${tabsToPin.length} ${pluralize(tabsToPin.length, 'tab', 'tabs')}`,
                });
            } catch {
                toast({
                    type: 'error',
                    message: `Failed to ${shouldPin ? 'pin' : 'unpin'} tabs.`,
                });
            }

            handleCloseMenu();
        },
        [tabs, handleCloseMenu]
    );

    return (
        <BasicListItem>
            <BasicAccordion
                expanded={accordionOpen}
                onChange={handleAccordionChange}
                slotProps={{
                    transition: {
                        unmountOnExit: true,
                        addEndListener: () =>
                            accordionOpen &&
                            accordionRef.current &&
                            getScrollableParent(accordionRef.current)?.scrollBy({
                                behavior: 'smooth',
                                top: accordionRef.current.getBoundingClientRect().y - 140,
                            }),
                    },
                }}>
                <Box display='flex' alignItems='center' gap='5px'>
                    <BasicAccordionSummary ref={accordionRef}>
                        <Favicon url={favIconUrl} />

                        <EllipsesTypography>{title}</EllipsesTypography>

                        <Chip color='primary' label={tabs.length.toString()} size='small' />

                        {allTabsMuted && <VolumeOffIcon sx={{ fontSize: '1rem' }} />}
                        {hasUnmutedAudibleTab && <AnimatedVolumeIcon sx={{ fontSize: '1rem' }} />}

                        {someTabsCapturingVideo && <VideocamIcon sx={{ fontSize: '1rem' }} />}

                        {someTabsCapturingAudio && <MicIcon sx={{ fontSize: '1rem' }} />}
                    </BasicAccordionSummary>

                    <Tooltip title={`${groupType === 'Window' ? 'Window' : 'Group'} Options`} placement='left' arrow>
                        <IconButton onClick={handleOpenMenu}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Tooltip>

                    <HoverMenu anchorEl={anchor} open={open} onClose={handleCloseMenu}>
                        <MenuItem onClick={handleCloseTabs} disableRipple>
                            <CancelIcon />
                            Close All
                        </MenuItem>

                        <MenuItem onClick={() => handleMuteTabs(!someTabsMuted)} disableRipple>
                            {someTabsMuted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                            {someTabsMuted ? 'Unmute All' : 'Mute All'}
                        </MenuItem>

                        <MenuItem disabled={allTabsDiscardedOrActive} onClick={handleSuspendTabs} disableRipple>
                            <BedtimeIcon />
                            Hibernate All
                        </MenuItem>

                        <MenuItem onClick={() => handlePinTabs(!someTabsPinned)} disableRipple>
                            <PushPinIcon />
                            {someTabsPinned ? 'Unpin All' : 'Pin All'}
                        </MenuItem>

                        {groupType !== 'Window' && (
                            <MenuItem onClick={handleMoveAllToWindow} disableRipple>
                                <WebAssetIcon />
                                New Window
                            </MenuItem>
                        )}
                    </HoverMenu>
                </Box>

                <AccordionDetails>
                    <BasicList>
                        {tabs.map((tab) => (
                            <TabListItem
                                key={`tab-${tab.id}`}
                                id={tab.id}
                                title={tab.title}
                                favIconUrl={tab.favIconUrl}
                                url={tab.url}
                                active={tab.active}
                                discarded={tab.discarded}
                                muted={Boolean(tab.mutedInfo?.muted)}
                                audible={tab.audible}
                                pinned={tab.pinned}
                                windowId={tab.windowId}
                            />
                        ))}
                    </BasicList>
                </AccordionDetails>
            </BasicAccordion>
        </BasicListItem>
    );
};

const TabManagerListItem = ({
    title,
    tabs,
    groupType,
}: {
    title: string;
    tabs: chrome.tabs.Tab[];
    groupType: AppData['manageTabsGroupBy'];
}) =>
    groupType !== 'Window' && tabs.length === 1 ? (
        <TabListItem
            id={tabs[0].id}
            title={tabs[0].title}
            favIconUrl={tabs[0].favIconUrl}
            url={tabs[0].url}
            active={tabs[0].active}
            discarded={tabs[0].discarded}
            muted={Boolean(tabs[0].mutedInfo?.muted)}
            audible={tabs[0].audible}
            pinned={tabs[0].pinned}
            windowId={tabs[0].windowId}
        />
    ) : (
        <TabGroupListItem groupType={groupType} title={title} tabs={tabs} />
    );

export default TabManagerListItem;
