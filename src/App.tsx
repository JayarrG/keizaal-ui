import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './App.module.css';
import mountainBg from './assets/backgrounds/mountain_bg.png';
import testingBg from './assets/backgrounds/testing_bg.jpg';
import dragonEmblem from './assets/dragon_emblem.png';
import dividerOrnament from './assets/divider_ornament.png';
import modelPreview from './assets/backgrounds/h6yfu3guts181.gif';

import {
  Panel, ScrollPanel, Grid, Modal, Tooltip, Accordion,
  TabBar, DialogPanel,
  Button, Slider, Toggle, Checkbox, TextInput, Dropdown, Stepper, ContextMenu,
  ProgressBar, StatLine, Badge, ItemSlot, List,
  NotificationStack, useNotifications, LoadingSpinner, ConfirmDialog,
  Divider, Label,
  Book, ColorPicker,
} from './components';

const topTabs = [
  { id: 'uiux', label: 'UI / UX' },
  { id: 'concepts', label: 'Concepts', className: styles.glowTab },
];

const uiuxSubTabs = [
  { id: 'containers', label: 'Containers' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'data', label: 'Data Display' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'utility', label: 'Utility' },
];

const conceptSubTabs = [
  { id: 'inventory', label: 'Inventory' },
  { id: 'interaction', label: 'Interaction Menu' },
  { id: 'skills', label: 'Skills Menu' },
  { id: 'death', label: 'Death Screen' },
  { id: 'chat', label: 'Chatbox' },
  { id: 'book', label: 'Book' },
];

export default function App() {
  const [topTab, setTopTab] = useState('uiux');
  const [uiuxTab, setUiuxTab] = useState('containers');
  const [conceptTab, setConceptTab] = useState('inventory');
  const { toasts, push } = useNotifications();

  const subTabs = topTab === 'uiux' ? uiuxSubTabs : conceptSubTabs;
  const activeSubTab = topTab === 'uiux' ? uiuxTab : conceptTab;
  const setActiveSubTab = topTab === 'uiux' ? setUiuxTab : setConceptTab;

  const pageTitle = subTabs.find(t => t.id === activeSubTab)?.label ?? '';

  return (
    <div className={styles.app} style={{ backgroundImage: `url(${testingBg})` }}>
      <ColorPicker />
      <TabBar tabs={topTabs} activeId={topTab} onSelect={setTopTab} bumperLeft={null} bumperRight={null} />
      <div className={styles.subTabRow}>
        <TabBar tabs={subTabs} activeId={activeSubTab} onSelect={setActiveSubTab} bumperLeft={null} bumperRight={null} className={styles.subTabBar} />
      </div>
      <div className={styles.page}>
        <ScrollPanel maxHeight="calc(100vh - 96px)">
          <div className={styles.content}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            {topTab === 'uiux' && uiuxTab === 'containers' && <ContainersDemo />}
            {topTab === 'uiux' && uiuxTab === 'inputs' && <InputsDemo />}
            {topTab === 'uiux' && uiuxTab === 'data' && <DataDemo />}
            {topTab === 'uiux' && uiuxTab === 'feedback' && <FeedbackDemo push={push} />}
            {topTab === 'uiux' && uiuxTab === 'utility' && <UtilityDemo />}
            {topTab === 'concepts' && conceptTab === 'inventory' && <InventoryConcept push={push} />}
            {topTab === 'concepts' && conceptTab === 'interaction' && <InteractionConcept push={push} />}
            {topTab === 'concepts' && conceptTab === 'skills' && <SkillsConcept push={push} />}
            {topTab === 'concepts' && conceptTab === 'death' && <DeathScreenConcept />}
            {topTab === 'concepts' && conceptTab === 'chat' && <ChatboxConcept />}
            {topTab === 'concepts' && conceptTab === 'book' && <BookConcept />}
          </div>
        </ScrollPanel>
      </div>
      <NotificationStack toasts={toasts} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <Label size="caption" color="dim" uppercase>{title}</Label>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function ContainersDemo() {
  const [activeCard, setActiveCard] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [resizeSize, setResizeSize] = useState({ w: 0, h: 420 });

  const onGripDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const startW = resizeRef.current?.offsetWidth ?? 400;
    const startH = resizeRef.current?.offsetHeight ?? 200;
    const onMove = (ev: MouseEvent) => {
      setResizeSize({ w: Math.max(200, startW + ev.clientX - startX), h: Math.max(120, startH + ev.clientY - startY) });
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  return (
    <>
      <Section title="Panel">
        <div className={styles.row}>
          <Panel corners interactive active={activeCard === 0} onClick={() => setActiveCard(0)} bg={mountainBg}>
            <div className={styles.demoCard}><Label size="heading" color="bright">Panel A</Label><Badge variant="accent">active</Badge></div>
          </Panel>
          <Panel corners interactive active={activeCard === 1} topAccent onClick={() => setActiveCard(1)} bg={mountainBg}>
            <div className={styles.demoCardFeatured}>
              <div className={styles.emblem} style={{ WebkitMaskImage: `url(${dragonEmblem})`, maskImage: `url(${dragonEmblem})` }} />
              <div className={styles.dividerImg} style={{ WebkitMaskImage: `url(${dividerOrnament})`, maskImage: `url(${dividerOrnament})` }} />
              <Label size="heading" color="bright">Featured</Label>
              <Badge variant="accent">03 / 03</Badge>
            </div>
          </Panel>
          <Panel corners interactive accent="#6ca4c4" active={activeCard === 2} onClick={() => setActiveCard(2)}>
            <div className={styles.demoCard}><Label size="heading" color="bright">Custom Color</Label><Badge>accent="#6ca4c4"</Badge></div>
          </Panel>
        </div>
      </Section>

      <Section title="Shaped Panels">
        <Label size="caption" color="dim" uppercase>notched corners</Label>
        <div className={styles.row}>
          <Panel notch={16} corners={false}>
            <div style={{ padding: '24px 32px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">All Corners</Label>
              <Label size="caption" color="dim">notch={'{16}'}</Label>
            </div>
          </Panel>
          <Panel notch={{ tl: 24, br: 24 }} corners={false}>
            <div style={{ padding: '24px 32px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">Diagonal</Label>
              <Label size="caption" color="dim">tl: 24, br: 24</Label>
            </div>
          </Panel>
          <Panel notch={{ tl: 20, tr: 20 }} corners={false}>
            <div style={{ padding: '24px 32px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">Top Only</Label>
              <Label size="caption" color="dim">tl: 20, tr: 20</Label>
            </div>
          </Panel>
        </div>
        <Label size="caption" color="dim" uppercase>indented sides + combinations</Label>
        <div className={styles.row}>
          <Panel indent={8} corners={false}>
            <div style={{ padding: '24px 40px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">Side Indent</Label>
              <Label size="caption" color="dim">indent={'{8}'}</Label>
            </div>
          </Panel>
          <Panel indent={{ left: 12, right: 12 }} notch={16} corners={false}>
            <div style={{ padding: '24px 40px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">Full Combo</Label>
              <Label size="caption" color="dim">notch + indent + corners</Label>
            </div>
          </Panel>
          <Panel indent={{ top: 10, bottom: 10 }} corners={false}>
            <div style={{ padding: '32px 40px', position: 'relative', zIndex: 1 }}>
              <Label size="heading" color="bright">Top/Bottom</Label>
              <Label size="caption" color="dim">indent + corners</Label>
            </div>
          </Panel>
        </div>
      </Section>

      <Section title="Resizable Panel">
        <div ref={resizeRef} className={styles.resizeOuter} style={resizeSize.w ? { width: resizeSize.w, height: resizeSize.h } : { height: resizeSize.h }}>
          <Panel corners topAccent>
            <div className={styles.resizeContent}>
              <Label size="heading" color="bright">Character Info</Label>
              <Divider />
              <div className={styles.resizeStats}>
                <StatLine label="Name" value="Aldric" />
                <StatLine label="Race" value="Nord" />
                <StatLine label="Level" value={42} />
                <StatLine label="Class" value="Warrior" />
              </div>
              <Divider ornament />
              <Label size="caption" color="dim" uppercase>Health</Label>
              <ProgressBar value={78} max={100} accent="#c46c6c" showValue />
              <Label size="caption" color="dim" uppercase>Stamina</Label>
              <ProgressBar value={55} max={100} accent="#6cc470" showValue />
              <div style={{ marginTop: 'auto', opacity: 0.3 }}>
                <Label size="caption" color="dim">drag the corner to resize</Label>
              </div>
            </div>
          </Panel>
          <div className={styles.resizeGrip} onMouseDown={onGripDown} />
        </div>
      </Section>

      <Section title="Accordion">
        <div style={{ maxWidth: 600 }}>
          <Accordion title="Section One" defaultOpen>
            <Label color="dim">content inside an accordion panel</Label>
          </Accordion>
          <Accordion title="Section Two">
            <Label color="dim">another collapsible section</Label>
          </Accordion>
          <Accordion title="Section Three">
            <Label color="dim">third section here</Label>
          </Accordion>
        </div>
      </Section>

      <Section title="Modal">
        <Button variant="text" onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Label size="heading" color="bright">Modal Title</Label>
          <Divider />
          <div style={{ marginTop: 12 }}>
            <Label color="dim">this is a modal with backdrop blur, escape to close</Label>
          </div>
        </Modal>
      </Section>

      <Section title="Tooltip (hover over)">
        <div className={styles.row}>
          <Tooltip content="top tooltip" position="top"><Button variant="text">Top</Button></Tooltip>
          <Tooltip content="bottom tooltip" position="bottom"><Button variant="text">Bottom</Button></Tooltip>
          <Tooltip content="left tooltip" position="left"><Button variant="text">Left</Button></Tooltip>
          <Tooltip content="right tooltip" position="right"><Button variant="text">Right</Button></Tooltip>
        </div>
      </Section>

      <Section title="Book">
        <Book
          title="Liber Primus"
          author="Auctor Ignotus"
          pages={[
            <p key={0}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>,
            <p key={1}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</p>,
            <p key={2}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>,
            <p key={3}>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>,
            <p key={4}>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.</p>,
            <p key={5}>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>,
            <div key={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <p style={{ fontStyle: 'italic', color: '#5a4a38' }}>Finis</p>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(90,74,56,0.4), transparent)' }} />
            </div>,
          ]}
        />
      </Section>

      <Section title="Grid">
        <Grid cols={6} cellSize={48} gap={4} framed>
          {Array.from({ length: 18 }, (_, i) => (
            <ItemSlot key={i} size={48} empty={i > 5} rarity={i < 2 ? 'rare' : i < 4 ? 'uncommon' : undefined} />
          ))}
        </Grid>
      </Section>

      <Section title="ScrollPanel">
        <div style={{ maxWidth: 500 }}>
          <ScrollPanel maxHeight={150}>
            <List
              items={Array.from({ length: 20 }, (_, i) => ({
                id: String(i),
                content: `scroll item ${i + 1}`,
              }))}
            />
          </ScrollPanel>
        </div>
      </Section>
    </>
  );
}

function InputsDemo() {
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(128);
  const [toggleVal, setToggleVal] = useState(true);
  const [checkA, setCheckA] = useState(true);
  const [checkB, setCheckB] = useState(false);
  const [text, setText] = useState('');
  const [dropdown, setDropdown] = useState('med');
  const [stepVal, setStepVal] = useState(5);

  return (
    <>
      <Section title="Context Menu (right-click)">
        <div className={styles.row}>
          <ContextMenu
            items={[
              { id: 'equip', label: 'Equip' },
              { id: 'use', label: 'Use' },
              { id: 'inspect', label: 'Inspect' },
              { id: 'div1', label: '', divider: true },
              { id: 'move', label: 'Move to Chest' },
              { id: 'favorite', label: 'Favorite' },
              { id: 'div2', label: '', divider: true },
              { id: 'drop', label: 'Drop', danger: true },
              { id: 'destroy', label: 'Destroy', danger: true },
            ]}
            onSelect={() => {}}
          >
            <Panel corners={false} interactive>
              <div style={{ padding: '8px 16px' }}>
                <Label color="bright">Iron Sword</Label>
                <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#b85555', textShadow: '0 0 8px rgba(184,85,85,0.6)' }}>Right-click me</span>
              </div>
            </Panel>
          </ContextMenu>

          <ContextMenu
            items={[
              { id: 'talk', label: 'Talk' },
              { id: 'trade', label: 'Trade' },
              { id: 'follow', label: 'Follow' },
              { id: 'div1', label: '', divider: true },
              { id: 'pickpocket', label: 'Pickpocket' },
              { id: 'attack', label: 'Attack', danger: true },
            ]}
            onSelect={() => {}}
          >
            <Panel corners={false} interactive>
              <div style={{ padding: '8px 16px' }}>
                <Label color="bright">Lydia</Label>
                <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#b85555', textShadow: '0 0 8px rgba(184,85,85,0.6)' }}>Right-click me</span>
              </div>
            </Panel>
          </ContextMenu>
        </div>
      </Section>

      <Section title="Button">
        <div className={styles.row}>
          {(['cube', 'circle', 'diamond', 'text'] as const).map((v) => (
            <div key={v} className={styles.col}>
              <Label size="caption" color="dim" uppercase>{v}</Label>
              <div className={styles.row}>
                <Button variant={v}>A</Button>
                <Button variant={v} active>B</Button>
                <Button variant={v} disabled>C</Button>
              </div>
            </div>
          ))}
        </div>
        <Label size="caption" color="dim" uppercase>dynamic sizes</Label>
        <div className={styles.row}>
          {[28, 36, 48, 64, 80].map((s) => (
            <Button key={s} variant="cube" size={s}>{s}</Button>
          ))}
        </div>
        <Label size="caption" color="dim" uppercase>per-button accent</Label>
        <div className={styles.row}>
          <Button variant="cube" accent="#c46c6c" active>Red</Button>
          <Button variant="cube" accent="#6cc470" active>Green</Button>
          <Button variant="cube" accent="#6ca4c4" active>Blue</Button>
          <Button variant="cube" accent="#a06cc4" active>Purple</Button>
        </div>
        <Label size="caption" color="dim" uppercase>notched</Label>
        <div className={styles.row}>
          <Button variant="cube" notch={8}>A</Button>
          <Button variant="cube" notch={12} active>B</Button>
          <Button variant="text" notch={10}>Accept</Button>
          <Button variant="text" notch={{ tl: 12, br: 12 }} active>Confirm</Button>
          <Button variant="text" notch={{ tr: 10, bl: 10 }}>Decline</Button>
        </div>
        <Label size="caption" color="dim" uppercase>locked</Label>
        <div className={styles.row}>
          <Button variant="cube" locked>A</Button>
          <Button variant="cube" locked>B</Button>
          <Button variant="circle" locked>C</Button>
          <Button variant="text" locked>Locked</Button>
        </div>
      </Section>

      <Section title="Slider">
        <div style={{ maxWidth: 600 }}>
          <Slider value={volume} onChange={setVolume} label="Volume" />
          <div style={{ height: 8 }} />
          <Slider value={brightness} onChange={setBrightness} label="Brightness" max={255} />
          <div style={{ height: 8 }} />
          <Slider value={50} onChange={() => {}} label="Locked" locked />
        </div>
      </Section>

      <Section title="Toggle">
        <div className={styles.row}>
          <Toggle checked={toggleVal} onChange={setToggleVal} label="Enabled" />
          <Toggle checked={!toggleVal} onChange={(v) => setToggleVal(!v)} label="Inverted" />
          <Toggle checked={false} onChange={() => {}} label="Locked" locked />
        </div>
      </Section>

      <Section title="Checkbox">
        <div className={styles.row}>
          <Checkbox checked={checkA} onChange={setCheckA} label="Show helmet" />
          <Checkbox checked={checkB} onChange={setCheckB} label="Enable PvP" />
          <Checkbox checked={false} onChange={() => {}} label="Locked option" locked />
        </div>
      </Section>

      <Section title="TextInput">
        <div style={{ maxWidth: 500 }}>
          <TextInput value={text} onChange={setText} label="Character Name" placeholder="enter name..." />
          <div style={{ height: 8 }} />
          <TextInput value="" onChange={() => {}} label="With Error" placeholder="..." error="name already taken" />
          <div style={{ height: 8 }} />
          <TextInput value="Locked field" onChange={() => {}} label="Locked Input" locked />
        </div>
      </Section>

      <Section title="Dropdown">
        <Dropdown
          label="Difficulty"
          options={[
            { id: 'easy', label: 'Easy' },
            { id: 'med', label: 'Medium' },
            { id: 'hard', label: 'Hard' },
            { id: 'legend', label: 'Legendary' },
          ]}
          value={dropdown}
          onChange={setDropdown}
        />
      </Section>

      <Section title="Stepper">
        <div className={styles.row}>
          <Stepper value={stepVal} onChange={setStepVal} label="Quantity" min={0} max={20} />
          <Stepper value={stepVal} onChange={setStepVal} label="Level" min={1} max={100} step={5} />
        </div>
      </Section>

    </>
  );
}

function DataDemo() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState('b');

  return (
    <>
      <Section title="ProgressBar">
        <div style={{ maxWidth: 600 }} className={styles.col}>
          <ProgressBar value={72} label="XP" showValue />
          <ProgressBar value={30} max={50} label="Quest" showValue accent="#6cc470" />
          <ProgressBar value={90} label="Loading" />
        </div>
      </Section>

      <Section title="StatLine">
        <div style={{ maxWidth: 500 }} className={styles.col}>
          <StatLine label="Strength" value={42} />
          <StatLine label="Agility" value={28} />
          <StatLine label="Intelligence" value={65} />
          <StatLine label="Luck" value={7} />
        </div>
      </Section>

      <Section title="Badge">
        <div className={styles.row}>
          <Badge>Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="ItemSlot">
        <div className={styles.row}>
          <ItemSlot size={64} rarity="legendary" selected={selectedItem === 'a'} onClick={() => setSelectedItem('a')} count={3} />
          <ItemSlot size={64} rarity="rare" selected={selectedItem === 'b'} onClick={() => setSelectedItem('b')} />
          <ItemSlot size={64} rarity="uncommon" selected={selectedItem === 'c'} onClick={() => setSelectedItem('c')} count={12} />
          <ItemSlot size={64} selected={selectedItem === 'd'} onClick={() => setSelectedItem('d')} />
          <ItemSlot size={64} empty />
          <ItemSlot size={64} empty />
        </div>
      </Section>

      <Section title="Inventory Grid">
        <Grid cols={8} cellSize={52} gap={3} framed>
          {Array.from({ length: 32 }, (_, i) => (
            <ItemSlot
              key={i}
              size={52}
              empty={i > 7}
              rarity={i === 0 ? 'legendary' : i < 3 ? 'rare' : i < 6 ? 'uncommon' : undefined}
              count={i === 0 ? 1 : i === 2 ? 5 : undefined}
              selected={selectedItem === `grid-${i}`}
              onClick={() => setSelectedItem(`grid-${i}`)}
            />
          ))}
        </Grid>
      </Section>

      <Section title="List">
        <div style={{ maxWidth: 500 }}>
          <List
            items={[
              { id: 'a', content: 'Iron Sword' },
              { id: 'b', content: 'Health Potion x3' },
              { id: 'c', content: 'Dragon Scale' },
              { id: 'd', content: 'Lockpick x12' },
              { id: 'e', content: 'Gold Ring' },
            ]}
            selectedId={selectedList}
            onSelect={setSelectedList}
          />
        </div>
      </Section>
    </>
  );
}

function FeedbackDemo({ push }: { push: (text: string, icon?: string) => void }) {
  const [showDialog, setShowDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Section title="Notifications">
        <div className={styles.row}>
          <Button variant="text" onClick={() => push('Item added to inventory', '!')}>Push Toast</Button>
          <Button variant="text" onClick={() => push('Quest completed!', '?')}>Quest Toast</Button>
          <Button variant="text" onClick={() => push('Connection lost', '!!')}>Warning Toast</Button>
        </div>
      </Section>

      <Section title="Dialog Panel">
        <Button variant="text" onClick={() => setShowDialog(!showDialog)}>
          {showDialog ? 'Hide Dialog' : 'Show Dialog'}
        </Button>
        {showDialog && (
          <DialogPanel
            speaker="Marcellus"
            body="Salve, viator. Tandem experrectus es. Fines transire conabaris, nonne?"
            options={[
              { id: 'a', text: 'Ubi sumus? Quid accidit?' },
              { id: 'b', text: 'Nihil memini...' },
              { id: 'c', text: 'Me dimitte.', persuasion: 'persuade' },
            ]}
            onSelect={(id) => { push(`Selected: option ${id}`); setShowDialog(false); }}
          />
        )}
      </Section>

      <Section title="Confirm Dialog">
        <Button variant="text" onClick={() => setConfirmOpen(true)}>Delete Item</Button>
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Item"
          message="are you sure you want to delete this item? this cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => { push('Item deleted'); setConfirmOpen(false); }}
          onCancel={() => setConfirmOpen(false)}
        />
      </Section>

      <Section title="Loading Spinner">
        <div className={styles.row}>
          <LoadingSpinner size={32} />
          <LoadingSpinner size={48} />
          <LoadingSpinner size={64} />
        </div>
      </Section>
    </>
  );
}

function UtilityDemo() {
  return (
    <>
      <Section title="Label">
        <div className={styles.col}>
          <Label size="title" color="bright">Title Label</Label>
          <Label size="heading" color="bright">Heading Label</Label>
          <Label size="body" color="default">Body Label</Label>
          <Label size="caption" color="dim" uppercase>Caption Label</Label>
          <Label size="body" color="accent">Accent Label</Label>
        </div>
      </Section>

      <Section title="Divider">
        <div className={styles.col} style={{ maxWidth: 600 }}>
          <Divider />
          <Label size="caption" color="dim">with ornament:</Label>
          <Divider ornament />
          <Label size="caption" color="dim">vertical (in a row):</Label>
          <div className={styles.row} style={{ height: 60 }}>
            <Label color="dim">Left</Label>
            <Divider direction="vertical" />
            <Label color="dim">Right</Label>
          </div>
        </div>
      </Section>

      <Section title="Badge">
        <div className={styles.row}>
          <Badge>Lv. 42</Badge>
          <Badge variant="accent">Equipped</Badge>
          <Badge variant="success">Online</Badge>
          <Badge variant="danger">Dead</Badge>
        </div>
      </Section>
    </>
  );
}

// ─── inventory data ───
const inventoryItems = [
  { name: 'Apple Cabbage Stew', type: 'Food', weight: 0.5, value: 8 },
  { name: 'Bear Claws', type: 'Ingredient', weight: 0.1, value: 2 },
  { name: 'Bone Meal (3)', type: 'Ingredient', weight: 0.5, value: 5 },
  { name: 'Bread (3)', type: 'Food', weight: 0.2, value: 2 },
  { name: 'Butterfly Wing (2)', type: 'Ingredient', weight: 0.1, value: 3 },
  { name: 'Cabbage (10)', type: 'Food', weight: 0.25, value: 2 },
  { name: 'Carrot (23)', type: 'Food', weight: 0.1, value: 1 },
  { name: 'Cooked Beef', type: 'Food', weight: 0.5, value: 5 },
  { name: 'Elves Ear (3)', type: 'Ingredient', weight: 0.1, value: 10 },
  { name: 'Frost Mirriam', type: 'Ingredient', weight: 0.1, value: 1 },
  { name: 'Frostbite Venom (2)', type: 'Poison', weight: 0.5, value: 21 },
  { name: 'Garlic (4)', type: 'Ingredient', weight: 0.25, value: 1 },
  { name: 'Green Apple (4)', type: 'Food', weight: 0.1, value: 3 },
  { name: 'Honeycomb', type: 'Ingredient', weight: 1, value: 5 },
  { name: 'Hunting Bow', type: 'Bow', weight: 7, value: 50 },
  { name: 'Iron Dagger', type: 'Weapon', weight: 2, value: 10 },
  { name: 'Iron Sword', type: 'Weapon', weight: 9, value: 25 },
  { name: 'Leather Armor', type: 'Armor', weight: 6, value: 65 },
  { name: 'Lockpick (12)', type: 'Tool', weight: 0, value: 3 },
  { name: 'Minor Health Potion (4)', type: 'Potion', weight: 0.5, value: 18 },
  { name: 'Salt Pile (6)', type: 'Ingredient', weight: 0.2, value: 2 },
  { name: 'Steel Shield', type: 'Armor', weight: 12, value: 150 },
  { name: 'Torch (3)', type: 'Tool', weight: 1, value: 2 },
  { name: 'Venison', type: 'Food', weight: 2, value: 4 },
];

const invCategories = ['All', 'Favorites', 'Weapons', 'Armor', 'Food', 'Potions', 'Ingredients', 'Misc'];

function InventoryConcept({ push }: { push: (text: string, icon?: string) => void }) {
  const [items, setItems] = useState(inventoryItems);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(5);
  const [sortCol, setSortCol] = useState<'name' | 'type' | 'weight' | 'value'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [invCategory, setInvCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['Hunting Bow', 'Iron Sword', 'Leather Armor']));
  const [confirmDrop, setConfirmDrop] = useState<string | null>(null);

  const categoryMap: Record<string, string[]> = {
    All: [],
    Favorites: [],
    Weapons: ['Weapon', 'Bow'],
    Armor: ['Armor'],
    Food: ['Food'],
    Potions: ['Potion', 'Poison'],
    Ingredients: ['Ingredient'],
    Misc: ['Tool'],
  };

  const filtered = invCategory === 'All'
    ? items
    : invCategory === 'Favorites'
      ? items.filter(i => favorites.has(i.name))
      : items.filter(i => categoryMap[invCategory]?.includes(i.type));

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol], bv = b[sortCol];
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return sortAsc ? cmp : -cmp;
  });

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const selected = selectedIdx !== null && selectedIdx < sorted.length ? sorted[selectedIdx] : null;
  const totalWeight = items.reduce((s, i) => s + i.weight, 0);

  const getContextItems = (item: typeof inventoryItems[0]) => {
    const isFav = favorites.has(item.name);
    const isEquippable = ['Weapon', 'Bow', 'Armor'].includes(item.type);
    const isConsumable = ['Food', 'Potion'].includes(item.type);
    return [
      ...(isEquippable ? [{ id: 'equip', label: 'Equip' }] : []),
      ...(isConsumable ? [{ id: 'consume', label: item.type === 'Food' ? 'Eat' : 'Drink' }] : []),
      { id: 'favorite', label: isFav ? 'Unfavorite' : 'Favorite' },
      { id: 'div1', label: '', divider: true },
      { id: 'drop', label: 'Drop', danger: true },
    ] as import('./components/ContextMenu/ContextMenu').ContextMenuItem[];
  };

  const handleAction = (actionId: string, item: typeof inventoryItems[0]) => {
    switch (actionId) {
      case 'equip':
        push(`Equipped ${item.name}`, '!');
        break;
      case 'consume':
        push(`Consumed ${item.name}`, '!');
        setItems(prev => prev.filter(i => i.name !== item.name));
        setSelectedIdx(null);
        break;
      case 'favorite':
        setFavorites(prev => {
          const next = new Set(prev);
          if (next.has(item.name)) { next.delete(item.name); push(`Removed ${item.name} from favorites`); }
          else { next.add(item.name); push(`Added ${item.name} to favorites`); }
          return next;
        });
        break;
      case 'drop':
        setConfirmDrop(item.name);
        break;
    }
  };

  return (
    <div className={styles.inventoryLayout}>
      <Panel corners topAccent className={styles.inventoryListPanel}>
        <div className={styles.inventoryTable}>
          <div className={styles.invTabs}>
            {invCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.invTab} ${cat === invCategory ? styles.invTabActive : ''}`}
                onClick={() => { setInvCategory(cat); setSelectedIdx(null); }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.invHeader}>
            <span className={`${styles.invCell} ${styles.invName}`} onClick={() => handleSort('name')}>
              Name {sortCol === 'name' ? (sortAsc ? '\u25B4' : '\u25BE') : ''}
            </span>
            <span className={`${styles.invCell} ${styles.invType}`} onClick={() => handleSort('type')}>
              Type {sortCol === 'type' ? (sortAsc ? '\u25B4' : '\u25BE') : ''}
            </span>
            <span className={`${styles.invCell} ${styles.invNum}`} onClick={() => handleSort('weight')}>
              Wgt {sortCol === 'weight' ? (sortAsc ? '\u25B4' : '\u25BE') : ''}
            </span>
            <span className={`${styles.invCell} ${styles.invNum}`} onClick={() => handleSort('value')}>
              Val {sortCol === 'value' ? (sortAsc ? '\u25B4' : '\u25BE') : ''}
            </span>
          </div>

          <ScrollPanel maxHeight={380}>
            {sorted.map((item, i) => (
              <ContextMenu
                key={item.name}
                items={getContextItems(item)}
                onSelect={(id) => handleAction(id, item)}
              >
                <div
                  className={`${styles.invRow} ${i === selectedIdx ? styles.invRowSelected : ''} ${i % 2 === 1 ? styles.invRowAlt : ''}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <span className={`${styles.invCell} ${styles.invName}`}>
                    {favorites.has(item.name) && <span className={styles.invFav}>*</span>}
                    {item.name}
                  </span>
                  <span className={`${styles.invCell} ${styles.invType}`}>{item.type}</span>
                  <span className={`${styles.invCell} ${styles.invNum} ${styles.invWgt}`}>{item.weight}</span>
                  <span className={`${styles.invCell} ${styles.invNum} ${styles.invVal}`}>{item.value}</span>
                </div>
              </ContextMenu>
            ))}
          </ScrollPanel>

          <div className={styles.invFooter}>
            <span>Carry Weight <strong className={styles.invWeightVal}>{totalWeight.toFixed(1)} / 305</strong></span>
            <span>Gold <strong className={styles.invGoldVal}>1018</strong></span>
          </div>
        </div>
      </Panel>

      <div className={styles.invRightSide}>
        <div className={styles.invModelArea}>
          {selected && (
            <img src={modelPreview} alt="3D preview" className={styles.invModelImg} draggable={false} />
          )}
        </div>
        {selected && (
          <Panel corners={false} topAccent className={styles.invDetailCard}>
            <div className={styles.invDetail}>
              <Label size="title" color="bright">{selected.name}</Label>
              <Divider />
              <div className={styles.invDetailRow}>
                <StatLine label="Weight" value={selected.weight} />
                <StatLine label="Value" value={selected.value} />
                <StatLine label="Type" value={selected.type} />
              </div>
            </div>
          </Panel>
        )}
      </div>

      <ConfirmDialog
        open={confirmDrop !== null}
        title="Drop Item"
        message={`Are you sure you want to drop ${confirmDrop}?`}
        confirmText="Drop"
        cancelText="Keep"
        onConfirm={() => {
          if (confirmDrop) {
            setItems(prev => prev.filter(i => i.name !== confirmDrop));
            push(`Dropped ${confirmDrop}`, '!');
            setSelectedIdx(null);
          }
          setConfirmDrop(null);
        }}
        onCancel={() => setConfirmDrop(null)}
      />
    </div>
  );
}

function InteractionConcept({ push }: { push: (text: string, icon?: string) => void }) {
  const [acting, setActing] = useState<string | null>(null);

  const handleAction = (label: string) => {
    setActing(label);
    push(`${label}...`, '?');
    setTimeout(() => setActing(null), 1500);
  };

  return (
    <div className={styles.interactionArea}>
      <div className={styles.interactionMenu}>
        <div className={styles.interactionIdentity}>
          <span className={styles.interactionTarget}>Lydia</span>
          <span className={styles.interactionSubtitle}>Housecarl</span>
          {acting && <span className={styles.interactionActing}>{acting}...</span>}
        </div>
        <div className={styles.interactionBar} />
        <div className={styles.interactionOptions}>
          {[
            { label: 'Talk', key: 'E' },
            { label: 'Trade', key: 'R' },
            { label: 'Command', key: 'F' },
            { label: 'Pickpocket', key: 'G' },
            { label: 'Introduce', key: 'T' },
          ].map((opt) => (
            <div
              key={opt.label}
              className={styles.interactionOption}
              onClick={() => handleAction(opt.label)}
            >
              <span className={styles.interactionKey}>{opt.key}</span>
              <span className={styles.interactionLabel}>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const skillsData = [
  { id: 'hunting', name: 'Hunting', level: 34, xp: 72, maxXp: 100, desc: 'Track and harvest wildlife for pelts and meat.', locked: false },
  { id: 'mining', name: 'Mining', level: 18, xp: 45, maxXp: 100, desc: 'Extract ores and gems from mineral deposits.', locked: false },
  { id: 'tailoring', name: 'Tailoring', level: 42, xp: 88, maxXp: 100, desc: 'Craft and repair cloth and leather garments.', locked: false },
  { id: 'alchemy', name: 'Alchemy', level: 27, xp: 31, maxXp: 100, desc: 'Brew potions, poisons, and transmute reagents.', locked: false },
  { id: 'smithing', name: 'Smithing', level: 53, xp: 15, maxXp: 100, desc: 'Forge and temper weapons and heavy armor.', locked: false },
  { id: 'enchanting', name: 'Enchanting', level: 12, xp: 60, maxXp: 100, desc: 'Imbue equipment with magical properties.', locked: false },
  { id: 'cooking', name: 'Cooking', level: 39, xp: 50, maxXp: 100, desc: 'Prepare meals that grant temporary buffs.', locked: false },
  { id: 'herbalism', name: 'Herbalism', level: 21, xp: 83, maxXp: 100, desc: 'Identify and gather alchemical ingredients.', locked: false },
  { id: 'taming', name: 'Taming', level: 0, xp: 0, maxXp: 100, desc: 'Befriend and train wild creatures.', locked: true },
  { id: 'runecraft', name: 'Runecraft', level: 0, xp: 0, maxXp: 100, desc: 'Inscribe magical runes onto surfaces and items.', locked: true },
];

function SkillsConcept({ push }: { push: (text: string, icon?: string) => void }) {
  const [skills, setSkills] = useState(skillsData);
  const [selectedId, setSelectedId] = useState('hunting');
  const [points, setPoints] = useState(5);

  const selected = skills.find(s => s.id === selectedId)!;

  const spendPoint = () => {
    if (points <= 0) return;
    setPoints(p => p - 1);
    setSkills(prev => prev.map(s =>
      s.id === selectedId ? { ...s, level: s.level + 1, xp: 0 } : s
    ));
    push(`${selected.name} leveled up!`, '!');
  };

  const refundPoint = () => {
    const sk = skills.find(s => s.id === selectedId)!;
    if (sk.level <= 1) return;
    setPoints(p => p + 1);
    setSkills(prev => prev.map(s =>
      s.id === selectedId ? { ...s, level: s.level - 1, xp: 0 } : s
    ));
    push(`Refunded 1 point from ${selected.name}`);
  };

  return (
    <div className={styles.skillsLayout}>
      {/* left: skill list */}
      <Panel notch={{ tl: 20, bl: 20 }} indent={{ right: 6 }} corners={false} className={styles.skillsListPanel}>
        <div className={styles.skillsList}>
          <div className={styles.skillsListHeader}>
            <Label size="caption" color="dim" uppercase>Skills</Label>
            <Badge variant="accent">{points} pts</Badge>
          </div>
          <Divider />
          <ScrollPanel maxHeight={400}>
            {skills.map(sk => (
              <div
                key={sk.id}
                className={`${styles.skillRow} ${sk.id === selectedId ? styles.skillRowActive : ''} ${sk.locked ? styles.skillRowLocked : ''}`}
                onClick={() => setSelectedId(sk.id)}
              >
                <div className={styles.skillRowTop}>
                  <span className={styles.skillName}>{sk.name}</span>
                  <span className={styles.skillLevel}>{sk.locked ? 'Locked' : `Lv. ${sk.level}`}</span>
                </div>
                {!sk.locked && (
                  <div className={styles.skillBarTrack}>
                    <div className={styles.skillBarFill} style={{ width: `${sk.xp}%` }} />
                  </div>
                )}
              </div>
            ))}
          </ScrollPanel>
        </div>
      </Panel>

      {/* right: skill detail */}
      <Panel notch={{ tr: 20, br: 20 }} indent={{ left: 6 }} corners={false} className={styles.skillDetailPanel}>
        <div className={styles.skillDetail}>
          <Label size="title" color="bright">{selected.name}</Label>
          {selected.locked
            ? <Badge variant="danger">Locked</Badge>
            : <Badge variant="accent">Level {selected.level}</Badge>
          }

          <Divider ornament />

          <Label color="dim">{selected.desc}</Label>

          {selected.locked ? (
            <Label size="caption" color="dim">This skill must be unlocked through gameplay.</Label>
          ) : (
            <>
              <div className={styles.skillDetailStats}>
                <StatLine label="Level" value={selected.level} />
                <StatLine label="XP" value={`${selected.xp} / ${selected.maxXp}`} />
              </div>

              <Label size="caption" color="dim" uppercase>Progress to next level</Label>
              <ProgressBar value={selected.xp} max={selected.maxXp} showValue accent="#6ca4c4" />

              <Divider />

              <div className={styles.skillActions}>
                <Tooltip content="Spend 1 skill point" position="top">
                  <Button variant="cube" accent="#6cc470" onClick={spendPoint} disabled={points <= 0} active>+</Button>
                </Tooltip>
                <Tooltip content="Refund 1 skill point" position="top">
                  <Button variant="cube" accent="#c46c6c" onClick={refundPoint} disabled={selected.level <= 1}>-</Button>
                </Tooltip>
                <span className={styles.skillPointsLabel}>
                  <Label size="caption" color="dim">{points} skill points available</Label>
                </span>
              </div>
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}

function DeathScreenConcept() {
  const [phase, setPhase] = useState<'idle' | 'dead' | 'respawned'>('idle');
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (phase !== 'dead') return;

    setVisible(false);
    setTextVisible(false);
    setSubVisible(false);
    setCountdown(10);

    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    const textTimer = setTimeout(() => setTextVisible(true), 800);
    const subTimer = setTimeout(() => setSubVisible(true), 2000);

    return () => { clearTimeout(textTimer); clearTimeout(subTimer); };
  }, [phase]);

  // countdown timer
  useEffect(() => {
    if (phase !== 'dead' || !subVisible) return;
    if (countdown <= 0) {
      setVisible(false);
      setTextVisible(false);
      setSubVisible(false);
      const t = setTimeout(() => setPhase('respawned'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, subVisible, countdown]);

  if (phase === 'idle') {
    return (
      <div className={styles.deathRespawned}>
        <Label size="title" color="bright">Death Screen Preview</Label>
        <div style={{ height: 8 }} />
        <Label color="dim">Fullscreen takeover with vignette, blur, and respawn timer.</Label>
        <div style={{ height: 16 }} />
        <Button variant="text" notch={10} onClick={() => setPhase('dead')}>Play Death Screen</Button>
      </div>
    );
  }

  if (phase === 'respawned') {
    return (
      <div className={styles.deathRespawned}>
        <Label size="title" color="bright">You have respawned at the temple.</Label>
        <div style={{ height: 16 }} />
        <Button variant="text" onClick={() => setPhase('dead')}>Play Again</Button>
        <div style={{ height: 8 }} />
        <Button variant="text" onClick={() => setPhase('idle')}>Back</Button>
      </div>
    );
  }

  return (
    <div className={`${styles.deathScreen} ${visible ? styles.deathVisible : ''}`}>
      <div className={styles.deathVignette} />
      <div className={styles.deathContent}>
        <h1 className={`${styles.deathTitle} ${textVisible ? styles.deathTitleVisible : ''}`}>YOU DIED</h1>
        <p className={`${styles.deathSub} ${subVisible ? styles.deathSubVisible : ''}`}>
          You will respawn inside a temple in {countdown}...
        </p>
      </div>
      <button className={styles.deathSkip} onClick={() => {
        setVisible(false);
        setTextVisible(false);
        setSubVisible(false);
        setTimeout(() => setPhase('idle'), 400);
      }}>
        Skip
      </button>
    </div>
  );
}

const slashCommands = [
  { cmd: '/help', desc: 'Show available commands' },
  { cmd: '/whisper', desc: 'Send a private message' },
  { cmd: '/party', desc: 'Manage your party' },
  { cmd: '/guild', desc: 'Guild chat channel' },
  { cmd: '/trade', desc: 'Request a trade with a player' },
  { cmd: '/roll', desc: 'Roll a random number' },
  { cmd: '/emote', desc: 'Perform an emote action' },
  { cmd: '/stuck', desc: 'Teleport to nearest safe location' },
  { cmd: '/report', desc: 'Report a player or bug' },
  { cmd: '/settings', desc: 'Open game settings' },
];

const chatInitialMessages = [
  { sender: 'System', text: 'Welcome to Keizaal Online.', system: true },
  { sender: 'Aldric', text: 'Anyone heading to the barrow tonight?' },
  { sender: 'Mira', text: 'I need a healer for the temple run' },
  { sender: 'System', text: 'Aldric has joined the party.', system: true },
  { sender: 'Valdis', text: 'Selling iron ingots, 5g each' },
  { sender: 'Aldric', text: 'On my way, give me a minute' },
  { sender: 'Mira', text: 'Meet at the south gate' },
];

const randomChats = [
  { sender: 'Valdis', text: 'Anyone know where to find ebony ore?' },
  { sender: 'Thrynn', text: 'Just cleared the old fort, good loot' },
  { sender: 'Mira', text: 'Healer LFG, temple run or dungeons' },
  { sender: 'Aldric', text: 'Watch out for wolves near the river' },
  { sender: 'System', text: 'Server restart in 30 minutes.', system: true },
  { sender: 'Kael', text: 'Trading enchanted bow for potions' },
  { sender: 'Valdis', text: 'Price check on daedric hearts?' },
  { sender: 'Thrynn', text: 'GG on that dragon fight earlier' },
  { sender: 'Mira', text: 'Thanks for the heal!' },
  { sender: 'System', text: 'Thrynn has reached level 40!', system: true },
  { sender: 'Kael', text: 'Anyone near Whiterun?' },
  { sender: 'Aldric', text: 'Crafting steel daggers if anyone needs' },
  { sender: 'Mira', text: 'waves from across the tavern', emote: true },
  { sender: 'Thrynn', text: 'sharpens his blade quietly', emote: true },
];

// stable color per sender name
const senderColors: Record<string, string> = {
  Aldric: '#c8b89a',
  Mira: '#b0c4b8',
  Valdis: '#c4b0a0',
  Thrynn: '#a8b8c8',
  Kael: '#c0b8d0',
};

function ChatboxConcept() {
  const [messages, setMessages] = useState(chatInitialMessages);
  const [input, setInput] = useState('');
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [selectedSlash, setSelectedSlash] = useState(0);
  const [chatFaded, setChatFaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = slashCommands.filter(c => c.cmd.startsWith(slashFilter || '/'));

  // scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => { setSelectedSlash(0); }, [slashFilter]);

  // reset fade timer on activity
  const resetFade = useCallback(() => {
    setChatFaded(false);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => setChatFaded(true), 8000);
  }, []);

  // initial fade timer
  useEffect(() => {
    resetFade();
    return () => { if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current); };
  }, [resetFade]);

  // random incoming messages every 8-15s
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(() => {
        const msg = randomChats[Math.floor(Math.random() * randomChats.length)];
        setMessages(prev => [...prev, msg]);
        resetFade();
        timerRef = scheduleNext();
      }, delay);
    };
    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [resetFade]);

  const handleInput = (val: string) => {
    setInput(val);
    resetFade();
    if (val.startsWith('/')) {
      setSlashOpen(true);
      setSlashFilter(val);
    } else {
      setSlashOpen(false);
    }
  };

  const selectCommand = (cmd: string) => {
    setInput(cmd + ' ');
    setSlashOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    resetFade();
    if (slashOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSlash(s => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSlash(s => Math.max(s - 1, 0));
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedSlash]) selectCommand(filtered[selectedSlash].cmd);
      } else if (e.key === 'Escape') {
        setSlashOpen(false);
      }
      return;
    }
    if (e.key === 'Enter' && input.trim()) {
      const trimmed = input.trim();
      if (trimmed.startsWith('/me ')) {
        setMessages(prev => [...prev, { sender: 'You', text: trimmed.slice(4), emote: true }]);
      } else {
        setMessages(prev => [...prev, { sender: 'You', text: trimmed }]);
      }
      setInput('');
      setSlashOpen(false);
    }
  };

  return (
    <div className={styles.chatLayout}>
      <div className={`${styles.chatBox} ${chatFaded ? styles.chatFaded : ''}`}
        onMouseEnter={resetFade}
      >
        {/* message area */}
        <div ref={scrollRef} className={styles.chatMessages}>
          {messages.map((msg, i) => {
            const isSystem = 'system' in msg && msg.system;
            const isEmote = 'emote' in msg && msg.emote;
            const isSelf = msg.sender === 'You';
            const nameColor = !isSystem && !isSelf && !isEmote ? senderColors[msg.sender] : undefined;

            if (isEmote) {
              return (
                <div key={i} className={`${styles.chatMsg} ${styles.chatMsgEmote}`}>
                  <span className={styles.chatEmoteText}>* {msg.sender} {msg.text}</span>
                </div>
              );
            }

            return (
              <div key={i} className={`${styles.chatMsg} ${isSystem ? styles.chatMsgSystem : ''}`}>
                <span
                  className={`${styles.chatSender} ${isSystem ? styles.chatSenderSystem : isSelf ? styles.chatSenderSelf : ''}`}
                  style={nameColor ? { color: nameColor } : undefined}
                >
                  {msg.sender}
                </span>
                <span className={styles.chatText}>{msg.text}</span>
              </div>
            );
          })}
        </div>

        {/* input bar */}
        <div className={styles.chatInputBar}>
          <input
            ref={inputRef}
            className={styles.chatInput}
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={resetFade}
            placeholder="Type a message... ( / for commands )"
          />
        </div>

        {/* slash command dropdown — below input */}
        {slashOpen && filtered.length > 0 && (
          <div className={styles.chatSlash}>
            {filtered.map((cmd, i) => (
              <div
                key={cmd.cmd}
                className={`${styles.chatSlashItem} ${i === selectedSlash ? styles.chatSlashActive : ''}`}
                onClick={() => selectCommand(cmd.cmd)}
                onMouseEnter={() => setSelectedSlash(i)}
              >
                <span className={styles.chatSlashCmd}>{cmd.cmd}</span>
                <span className={styles.chatSlashDesc}>{cmd.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookConcept() {
  const [bookTitle, setBookTitle] = useState('My Journal');
  const [bookAuthor, setBookAuthor] = useState('Dragonborn');
  const [bookColor, setBookColor] = useState('#2a1f14');
  const [pageTexts, setPageTexts] = useState([
    'This is the first page of my journal. Today I arrived in Whiterun and spoke with the Jarl.',
    'The road to Riverwood was treacherous. Wolves attacked near the river crossing but I dispatched them quickly.',
    'I have joined the Companions. Kodlak seems wise. Vilkas does not trust me yet.',
    'Discovered a Word Wall deep in Bleak Falls Barrow. The ancient script glows with power.',
  ]);

  const addPage = () => setPageTexts(prev => [...prev, '']);
  const updatePage = (idx: number, text: string) => {
    setPageTexts(prev => prev.map((p, i) => i === idx ? text : p));
  };
  const removePage = (idx: number) => {
    if (pageTexts.length <= 1) return;
    setPageTexts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.bookConceptLayout}>
      {/* left: live preview */}
      <div className={styles.bookPreview}>
        <Book
          title={bookTitle || 'Untitled'}
          author={bookAuthor || undefined}
          coverColor={bookColor}
          pages={pageTexts.map((text, i) => (
            <p key={i}>{text || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Empty page...</span>}</p>
          ))}
        />
      </div>

      {/* right: editor */}
      <Panel corners={false} topAccent className={styles.bookEditor}>
        <div className={styles.bookEditorContent}>
          <Label size="heading" color="bright">Book Editor</Label>
          <Divider />

          <TextInput value={bookTitle} onChange={setBookTitle} label="Title" />
          <TextInput value={bookAuthor} onChange={setBookAuthor} label="Author" />

          <div className={styles.bookColorRow}>
            <Label size="caption" color="dim" uppercase>Cover Color</Label>
            <input
              type="color"
              value={bookColor}
              onChange={(e) => setBookColor(e.target.value)}
              className={styles.bookColorInput}
            />
          </div>

          <Divider ornament />
          <Label size="caption" color="dim" uppercase>Pages ({pageTexts.length})</Label>

          <ScrollPanel maxHeight={240}>
            {pageTexts.map((text, i) => (
              <div key={i} className={styles.bookPageEditor}>
                <div className={styles.bookPageHeader}>
                  <Label size="caption" color="dim">Page {i + 1}</Label>
                  {pageTexts.length > 1 && (
                    <button className={styles.bookPageRemove} onClick={() => removePage(i)}>x</button>
                  )}
                </div>
                <textarea
                  className={styles.bookTextarea}
                  value={text}
                  onChange={(e) => updatePage(i, e.target.value)}
                  rows={3}
                  placeholder="Write something..."
                />
              </div>
            ))}
          </ScrollPanel>

          <Button variant="text" onClick={addPage}>Add Page</Button>
        </div>
      </Panel>
    </div>
  );
}