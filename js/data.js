export const EXERCISES=[

// PUSH
{id:'wall_pushup',name:'Wall Push-up',pattern:'push',muscle:'Ngực • Tay sau',eq:[],diff:1,icon:'↗️',type:'reps',rep:[12,20],next:'incline_pushup'},
{id:'incline_pushup',name:'Incline Push-up',pattern:'push',muscle:'Ngực • Tay sau',eq:['chair'],diff:1.5,icon:'📐',type:'reps',rep:[10,18],next:'knee_pushup'},
{id:'knee_pushup',name:'Knee Push-up',pattern:'push',muscle:'Ngực • Tay sau',eq:[],diff:1.8,icon:'🧎',type:'reps',rep:[8,15],next:'pushup'},
{id:'pushup',name:'Push-up',pattern:'push',muscle:'Ngực • Tay sau',eq:[],diff:2.4,icon:'💥',type:'reps',rep:[8,15],next:'diamond_pushup'},
{id:'diamond_pushup',name:'Diamond Push-up',pattern:'push',muscle:'Tay sau • Ngực',eq:[],diff:3.2,icon:'💎',type:'reps',rep:[6,12],next:'decline_pushup'},
{id:'decline_pushup',name:'Decline Push-up',pattern:'push',muscle:'Ngực trên • Vai',eq:['chair'],diff:3.6,icon:'⬆️',type:'reps',rep:[6,12],next:'archer_pushup'},
{id:'archer_pushup',name:'Archer Push-up',pattern:'push',muscle:'Ngực • Vai',eq:[],diff:4.4,icon:'🏹',type:'reps',rep:[4,8],next:'one_arm_assisted'},
{id:'one_arm_assisted',name:'Assisted One-arm Push-up',pattern:'push',muscle:'Ngực • Core',eq:['chair'],diff:5,icon:'1️⃣',type:'reps',rep:[3,7]},
{id:'pike_pushup',name:'Pike Push-up',pattern:'push',muscle:'Vai',eq:[],diff:2.8,icon:'🔺',type:'reps',rep:[6,12],next:'elevated_pike'},
{id:'elevated_pike',name:'Elevated Pike Push-up',pattern:'push',muscle:'Vai',eq:['chair'],diff:3.8,icon:'⛰️',type:'reps',rep:[5,10]},
{id:'chair_dip',name:'Chair Dip',pattern:'push',muscle:'Tay sau',eq:['chair'],diff:2.7,icon:'🪑',type:'reps',rep:[8,15]},
{id:'db_floor_press',name:'Dumbbell Floor Press',pattern:'push',muscle:'Ngực',eq:['dumbbell'],diff:2.4,icon:'🏋️',type:'reps',rep:[8,15]},
{id:'db_shoulder_press',name:'Dumbbell Shoulder Press',pattern:'push',muscle:'Vai',eq:['dumbbell'],diff:2.8,icon:'🏋️',type:'reps',rep:[8,12]},
{id:'db_lateral_raise',name:'Dumbbell Lateral Raise',pattern:'push',muscle:'Vai giữa',eq:['dumbbell'],diff:2.2,icon:'🪽',type:'reps',rep:[12,20]},
// PULL
{id:'table_row',name:'Table Row',pattern:'pull',muscle:'Lưng • Tay trước',eq:['table'],diff:2,icon:'🪵',type:'reps',rep:[8,15],next:'inverted_row'},
{id:'band_row',name:'Band Row',pattern:'pull',muscle:'Lưng',eq:['band'],diff:1.8,icon:'〰️',type:'reps',rep:[12,20]},
{id:'db_row',name:'One-arm Dumbbell Row',pattern:'pull',muscle:'Lưng • Tay trước',eq:['dumbbell'],diff:2.4,icon:'🏋️',type:'reps',rep:[8,15]},
{id:'dead_hang',name:'Dead Hang',pattern:'pull',muscle:'Grip • Vai',eq:['bar'],diff:1.4,icon:'🧗',type:'time',rep:[20,45],next:'scap_pull'},
{id:'scap_pull',name:'Scapular Pull-up',pattern:'pull',muscle:'Xô • Bả vai',eq:['bar'],diff:2,icon:'🧗',type:'reps',rep:[6,12],next:'negative_pullup'},
{id:'negative_pullup',name:'Negative Pull-up',pattern:'pull',muscle:'Xô • Tay trước',eq:['bar'],diff:2.6,icon:'⬇️',type:'reps',rep:[3,6],next:'pullup'},
{id:'band_pullup',name:'Band-assisted Pull-up',pattern:'pull',muscle:'Xô • Tay trước',eq:['bar','band'],diff:2.5,icon:'🧗',type:'reps',rep:[5,10],next:'pullup'},
{id:'pullup',name:'Pull-up',pattern:'pull',muscle:'Xô • Tay trước',eq:['bar'],diff:3.5,icon:'🧗',type:'reps',rep:[4,10],next:'chest_to_bar'},
{id:'chest_to_bar',name:'Chest-to-bar Pull-up',pattern:'pull',muscle:'Lưng trên',eq:['bar'],diff:4.3,icon:'⚡',type:'reps',rep:[3,8]},
{id:'band_facepull',name:'Band Face Pull',pattern:'pull',muscle:'Vai sau • Bả vai',eq:['band'],diff:2.1,icon:'🎯',type:'reps',rep:[12,20]},
// LEGS
{id:'chair_squat',name:'Chair Squat',pattern:'legs',muscle:'Đùi • Mông',eq:['chair'],diff:1.3,icon:'🪑',type:'reps',rep:[12,20],next:'squat'},
{id:'squat',name:'Bodyweight Squat',pattern:'legs',muscle:'Đùi • Mông',eq:[],diff:2,icon:'🦵',type:'reps',rep:[12,25],next:'split_squat'},
{id:'split_squat',name:'Split Squat',pattern:'legs',muscle:'Đùi • Mông',eq:[],diff:2.6,icon:'🦵',type:'reps',rep:[8,14],next:'bulgarian'},
{id:'bulgarian',name:'Bulgarian Split Squat',pattern:'legs',muscle:'Đùi • Mông',eq:['chair'],diff:3.3,icon:'🔥',type:'reps',rep:[8,14],next:'assisted_pistol'},
{id:'assisted_pistol',name:'Assisted Pistol Squat',pattern:'legs',muscle:'Đùi • Thăng bằng',eq:['chair'],diff:4,icon:'🎯',type:'reps',rep:[5,10],next:'pistol'},
{id:'pistol',name:'Pistol Squat',pattern:'legs',muscle:'Đùi • Core',eq:[],diff:5,icon:'🦿',type:'reps',rep:[3,8]},
{id:'glute_bridge',name:'Glute Bridge',pattern:'legs',muscle:'Mông • Gân kheo',eq:[],diff:1.8,icon:'🌉',type:'reps',rep:[12,20]},
{id:'db_rdl',name:'Dumbbell RDL',pattern:'legs',muscle:'Gân kheo • Mông',eq:['dumbbell'],diff:2.7,icon:'🏋️',type:'reps',rep:[8,15]},
{id:'calf_raise',name:'Calf Raise',pattern:'legs',muscle:'Bắp chân',eq:[],diff:1.6,icon:'🦶',type:'reps',rep:[15,30]},
// CORE
{id:'deadbug',name:'Dead Bug',pattern:'core',muscle:'Core',eq:[],diff:1.3,icon:'🐞',type:'reps',rep:[8,14],next:'plank'},
{id:'plank',name:'Plank',pattern:'core',muscle:'Core',eq:[],diff:2,icon:'🧱',type:'time',rep:[30,60],next:'hollow'},
{id:'hollow',name:'Hollow Body Hold',pattern:'core',muscle:'Core',eq:[],diff:2.8,icon:'🌙',type:'time',rep:[20,45],next:'leg_raise'},
{id:'leg_raise',name:'Lying Leg Raise',pattern:'core',muscle:'Bụng dưới',eq:[],diff:3,icon:'⬆️',type:'reps',rep:[8,15],next:'hanging_knee'},
{id:'hanging_knee',name:'Hanging Knee Raise',pattern:'core',muscle:'Core • Grip',eq:['bar'],diff:3.4,icon:'🧗',type:'reps',rep:[6,12],next:'hanging_leg'},
{id:'hanging_leg',name:'Hanging Leg Raise',pattern:'core',muscle:'Core',eq:['bar'],diff:4.3,icon:'⚡',type:'reps',rep:[5,10]},
{id:'tuck_lsit',name:'Tuck L-sit',pattern:'core',muscle:'Core • Hông',eq:['parallettes'],diff:3.3,icon:'📐',type:'time',rep:[10,25],next:'lsit'},
{id:'lsit',name:'L-sit',pattern:'core',muscle:'Core • Tay sau',eq:['parallettes'],diff:4.6,icon:'🧘',type:'time',rep:[8,20]},
];


export const EQUIPMENT = {
  chair: 'Ghế', bar: 'Xà đơn', band: 'Dây kháng lực', dumbbell: 'Dumbbell',
  table: 'Bàn chắc', parallettes: 'Parallettes'
};

export const PATTERN_LABEL = { push:'Push', pull:'Pull', legs:'Chân', core:'Core' };
export const PATTERN_MUSCLES = {
  push: ['Ngực','Vai','Tay sau','Core'],
  pull: ['Lưng','Xô','Tay trước','Cẳng tay'],
  legs: ['Đùi trước','Mông','Gân kheo','Bắp chân'],
  core: ['Core','Bụng','Hông']
};

export const PROGRAMS = [
  { id:'upper_push_core', name:'Upper Push + Core', duration:42, patterns:['push','core'], accent:'violet' },
  { id:'pull_strength', name:'Pull Strength', duration:44, patterns:['pull','core'], accent:'blue' },
  { id:'lower_foundation', name:'Lower Foundation', duration:46, patterns:['legs','core'], accent:'green' },
  { id:'full_body', name:'Full Body Balance', duration:50, patterns:['push','pull','legs','core'], accent:'orange' }
];

export const SAMPLE_TREND = [7600, 8100, 10400, 12100, 13700, 12800, 15100, 13900];
