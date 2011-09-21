var canvasWidth = 800, canvasHeight = 600;
var r;
var rootOfTheTree;
var allPoints;
var L_ORIGINAL;

var min_cluster_size = 4;

function Nodelist(_N1, _L1, _N2, _L2) {
	this.N1 = _N1;
	this.L1 = _L1;
	this.N2 = _N2;
	this.L2 = _L2;
}

function Node() {
	this.split_point = null;
	this.points = [];
	this.NL = null;
}

function Point(_x, _y, _CD, _RD) {
	this.x = _x;
	this.y = _y;
	this.CD = _CD;
	this.RD = _RD;	
}

function cluster_tree(N, parent_of_N, L) {
	if (L.length == 0) return;
	
	var s;
	N.split_point = s = L[0];
	L.splice(L.indexOf(s), 1);

	var N1 = new Node(), N2 = new Node(), z = false;
	for (var i = 0, ii = N.points.length; i < ii; i++) {
		if (N.points[i] == s) {
			z = true;
			continue;
		} else if (z == false) {
			N1.points[N1.points.length] = N.points[i];
		} else if (z == true) {
			N2.points[N2.points.length] = N.points[i];
		}
	}
	
	var L1 = [], L2 = [];
	z = false;
	for (var i = 0, ii = L_ORIGINAL.length; i < ii; i++) {
		if (L_ORIGINAL[i] == s) {
			z = true;
			continue;
		} else if (z == false) {
			L1[L1.length] = L_ORIGINAL[i];
		} else if (z == true) {
			L2[L2.length] = L_ORIGINAL[i];
		}
	}	

	N.NL = new Nodelist(N1, L1, N2, L2);
	
	var avg_rv_in_n1 = 0;
	for (var i = 0, ii = N1.points.length; i < ii; i++) { avg_rv_in_n1 += N1.points[i].RD; }
	avg_rv_in_n1 /=  N1.points.length;
	
	var avg_rv_in_n2 = 0;
	for (var i = 0, ii = N2.points.length; i < ii; i++) { avg_rv_in_n2 += N2.points[i].RD; }
	avg_rv_in_n2 /=  N2.points.length;	
	
	if ( (avg_rv_in_n1 / s.RD) > 0.75 || (avg_rv_in_n2 / s.RD) > 0.75 ) {
		cluster_tree(N, parent_of_N, L);		
	} else {		
		if (N1.points.length < min_cluster_size) { N.NL.N1 = N.NL.L1 = null; }		
		if (N2.points.length < min_cluster_size) { N.NL.N2 = N.NL.L2 = null; }
		
		if (N.NL.N1 == null && N.NL.L1 == null && N.NL.N2 == null && N.NL.L2 == null) return;
		
		/*if (s.r_dist and parent_of_N.split_point.r_dist are approximately the same) {
			let parent_of_N point to all nodes in NL instead of N;
		} else {
			let N point to all nodes in NL;
		}*/
		if (parent_of_N != null) {
			var v = Math.abs(s.RD - parent_of_N.split_point.RD);
			if (v > 0.7 && v < 0.8) {
				parent_of_N.NL = new Nodelist(N1, L1, N2, L2);
				N.NL = null;			
			} else {
				N.NL = new Nodelist(N1, L1, N2, L2);
			}		
		}
		
		if (N.NL.N1 != null && N.NL.L1 != null) cluster_tree(N.NL.N1, N, N.NL.L1);
		if (N.NL.N2 != null && N.NL.L2 != null) cluster_tree(N.NL.N2, N, N.NL.L2);
	}
}

function draw(node, color) {
	for (var i = 0, ii = node.points.length; i < ii; i++){
		r.circle(node.points[i].x, node.points[i].y, 5).attr("fill", color);
	}
	if (node.NL != null) {
		if (node.NL.N1 != null) draw(node.NL.N1, color);
		if (node.NL.N2 != null) draw(node.NL.N2, color);
	}
}

window.onload = function() {		
	r = Raphael("holder", canvasWidth, canvasHeight);	
	
	allPoints = [];	
	allPoints[0] = new Point(471, 132, 17.2046505341, 0);
	allPoints[1] = new Point(490, 133, 19.0262975904, 19.0262975904);
	allPoints[2] = new Point(489, 152, 18.2482875909, 16.7630546142);
	allPoints[3] = new Point(479, 151, 17.1172427686, 15.2643375225);
	allPoints[4] = new Point(511, 164, 18.3575597507, 18.2482875909);
	allPoints[5] = new Point(507, 149, 18.2482875909, 18.2482875909);
	allPoints[6] = new Point(514, 133, 19.2093727123, 18.2482875909);
	allPoints[7] = new Point(505, 128, 20.2237484162, 19.0262975904);
	allPoints[8] = new Point(493, 123, 23.2594066992, 19.0262975904);
	allPoints[9] = new Point(481, 118, 26, 17.2046505341);
	allPoints[10] = new Point(461, 139, 16.7630546142, 17.2046505341);
	allPoints[11] = new Point(477, 168, 20, 16.6433169771);
	allPoints[12] = new Point(504, 176, 27.1661554144, 18.3575597507);
	allPoints[13] = new Point(502, 148, 19.2093727123, 18.2482875909);
	allPoints[14] = new Point(424, 173, 29.1547594742, 19.1049731745);
	allPoints[15] = new Point(386, 198, 45.4862616622, 43.8634243989);
	allPoints[16] = new Point(289, 270, 39.6610640301, 26.4007575649);
	allPoints[17] = new Point(202, 138, 60.1082357086, 42.5440947724);
	allPoints[18] = new Point(127, 148, 64.8459713475, 49.6487663492);
	allPoints[19] = new Point(118, 260, 56.7538544947, 55.542776308);
	allPoints[20] = new Point(145, 359, 79.3221280602, 57.5586657246);
	allPoints[21] = new Point(235, 377, 52.810983706, 46.6904701197);
	allPoints[22] = new Point(328, 350, 41.7851648316, 40.5215991787);
	allPoints[23] = new Point(426, 317, 51.8555686499, 47.0106370942);
	allPoints[24] = new Point(413, 265, 40, 29.0172362571);
	allPoints[25] = new Point(473, 223, 38.275318418, 28.8617393793);
	allPoints[26] = new Point(516, 265, 40.5215991787, 26.83281573);
	allPoints[27] = new Point(543, 330, 24.7588368063, 18.7882942281);
	allPoints[28] = new Point(490, 404, 66.7083203206, 48.0416485979);
	allPoints[29] = new Point(550, 296, 29.1547594742, 24.3515913238);
	allPoints[30] = new Point(558, 217, 52.2398315464, 43.4626276242);
	allPoints[31] = new Point(544, 193, 43.4626276242, 34.4093010682);
	allPoints[32] = new Point(540, 148, 33.0151480384, 23.3452350599);
	allPoints[33] = new Point(567, 106, 50.9215082259, 43.8634243989);
	allPoints[34] = new Point(615, 123, 79.0569415042, 50.9215082259);
	allPoints[35] = new Point(615, 169, 74.5184540902, 55.2268050859);
	allPoints[36] = new Point(595, 153, 55.2268050859, 54.7083174664);
	allPoints[37] = new Point(535, 96, 43.8634243989, 35.902646142);
	allPoints[38] = new Point(467, 96, 36.2215405525, 26.0768096208);
	allPoints[39] = new Point(405, 112, 38.0525951809, 28.6356421266);
	allPoints[40] = new Point(305, 133, 57.008771255, 46.872166581);
	allPoints[41] = new Point(245, 180, 54.918120871, 45.6946386352);
	allPoints[42] = new Point(227, 222, 45.6946386352, 43.1045241245);
	allPoints[43] = new Point(220, 293, 14.1421356237, 15.5563491861);
	allPoints[44] = new Point(173, 246, 52.3545604508, 41.3037528561);
	allPoints[45] = new Point(216, 288, 15.2315462117, 14.1421356237);
	allPoints[46] = new Point(211, 274, 21.0237960416, 15.2315462117);
	allPoints[47] = new Point(235, 282, 17.7200451467, 15.6204993518);
	allPoints[48] = new Point(249, 309, 18.3847763109, 37.2155881319);
	allPoints[49] = new Point(236, 316, 15.2970585408, 18.3847763109);
	allPoints[50] = new Point(211, 315, 13.8924439894, 15.2970585408);
	allPoints[51] = new Point(198, 292, 22.2036033112, 15.6204993518);
	allPoints[52] = new Point(230, 265, 21.2132034356, 16.7630546142);
	allPoints[53] = new Point(256, 292, 18.3847763109, 16.4012194669);
	allPoints[54] = new Point(246, 305, 15.6204993518, 15.2970585408);
	allPoints[55] = new Point(233, 308, 13.3416640641, 15.2970585408);
	allPoints[56] = new Point(225, 281, 15.6524758425, 14.1421356237);
	allPoints[57] = new Point(251, 268, 24.5153013443, 17.2626765016);
	allPoints[58] = new Point(251, 283, 17.2626765016, 17.7200451467);
	allPoints[59] = new Point(234, 295, 15.6204993518, 13.3416640641);
	allPoints[60] = new Point(270, 307, 21.0950231097, 20.5182845287);
	allPoints[61] = new Point(251, 329, 24.5153013443, 19.8494332413);
	allPoints[62] = new Point(210, 302, 15.5563491861, 13.8924439894);
	allPoints[63] = new Point(198, 315, 23.0867927612, 13.8924439894);
	allPoints[64] = new Point(227, 331, 22.627416998, 17.4928556845);
	allPoints[65] = new Point(221, 313, 15.2970585408, 13.3416640641);
	allPoints[66] = new Point(218, 327, 21.0950231097, 13.8924439894);
	allPoints[67] = new Point(268, 286, 24.7588368063, 17.2626765016);
	allPoints[68] = new Point(278, 324, 37.2155881319, 40.5215991787);
	allPoints[69] = new Point(495, 300, 16.1245154966, 19.3132079158);
	allPoints[70] = new Point(480, 300, 19.3132079158, 28.8444102037);
	allPoints[71] = new Point(475, 339, 27.7308492477, 23.0217288664);
	allPoints[72] = new Point(499, 338, 26.83281573, 20.6155281281);
	allPoints[73] = new Point(503, 325, 20.6155281281, 19.4164878389);
	allPoints[74] = new Point(527, 304, 20.2484567313, 20.6155281281);
	allPoints[75] = new Point(504, 289, 26.4007575649, 16.1245154966);
	allPoints[76] = new Point(487, 282, 31.1448230048, 19.3132079158);
	allPoints[77] = new Point(487, 314, 19.4164878389, 16.1245154966);
	allPoints[78] = new Point(464, 324, 28.8444102037, 51.8555686499);
	allPoints[79] = new Point(476, 316, 23.0217288664, 19.3132079158);
	allPoints[80] = new Point(525, 347, 27.8567765544, 24.5153013443);
	allPoints[81] = new Point(520, 323, 21.6333076528, 20.2484567313);
	allPoints[82] = new Point(552, 314, 26.9258240357, 18.7882942281);
	allPoints[83] = new Point(536, 290, 31.0161248385, 20.2484567313);
	allPoints[84] = new Point(508, 305, 20.6155281281, 16.1245154966);
	allPoints[85] = new Point(535, 321, 18.7882942281, 20.2484567313);
	allPoints[86] = new Point(379, 316, 40.8533964316, 34.885527085);
	allPoints[87] = new Point(348, 300, 34.885527085, 29.0172362571);
	allPoints[88] = new Point(349, 253, 39.6988664826, 37.947331922);
	allPoints[89] = new Point(295, 223, 49.9799959984, 45.1774279923);
	allPoints[90] = new Point(335, 202, 45.1774279923, 39.1152144312);
	allPoints[91] = new Point(344, 159, 46.872166581, 43.2781700168);
	allPoints[92] = new Point(354, 101, 58.8557558782, 43.2781700168);
	allPoints[93] = new Point(293, 122, 63.0079360081, 46.1735855225);
	allPoints[94] = new Point(250, 148, 50.2891638427, 50.2891638427);
	allPoints[95] = new Point(185, 177, 42.5440947724, 41.3400532172);
	allPoints[96] = new Point(175, 118, 77.0778826902, 59.8414572015);
	allPoints[97] = new Point(145, 189, 49.6487663492, 42.5440947724);
	allPoints[98] = new Point(95, 216, 75.1531769122, 49.578221025);
	allPoints[99] = new Point(299, 190, 54.6443043693, 45.1774279923);
	allPoints[100] = new Point(381, 241, 37.947331922, 45.4862616622);
	allPoints[101] = new Point(436, 232, 47.6340214553, 38.275318418);
	allPoints[102] = new Point(391, 175, 43.8634243989, 29.6816441593);
	allPoints[103] = new Point(377, 131, 43.2781700168, 35.5105618091);
	allPoints[104] = new Point(431, 157, 19.1049731745, 19.1049731745);
	allPoints[105] = new Point(527, 225, 53.9073278878, 43.4626276242);
	allPoints[106] = new Point(610, 222, 65.1152823844, 52.2398315464);
	allPoints[107] = new Point(605, 261, 59.4810894319, 46.0108682813);
	allPoints[108] = new Point(562, 266, 46.0108682813, 32.3109888428);
	allPoints[109] = new Point(632, 314, 77.0778826902, 44.72135955);
	allPoints[110] = new Point(599, 357, 54.2033209315, 44.72135955);
	allPoints[111] = new Point(591, 313, 44.72135955, 39.0128184063);
	allPoints[112] = new Point(577, 368, 56.0802995712, 41.629316593);
	allPoints[113] = new Point(553, 367, 41.629316593, 34.4093010682);
	allPoints[114] = new Point(515, 384, 48.7031826475, 38.3275357935);
	allPoints[115] = new Point(466, 372, 48.0416485979, 34.205262753);
	allPoints[116] = new Point(413, 373, 53.0094331228, 43.1856457634);
	allPoints[117] = new Point(392, 395, 53.9351462406, 43.1856457634);
	allPoints[118] = new Point(339, 385, 53.8516480713, 41.7851648316);
	allPoints[119] = new Point(363, 362, 43.931765273, 41.7851648316);
	allPoints[120] = new Point(375, 359, 43.1856457634, 43.1856457634);
	allPoints[121] = new Point(393, 277, 29.0172362571, 37.947331922);
	allPoints[122] = new Point(317, 313, 40.5215991787, 34.885527085);
	allPoints[123] = new Point(289, 365, 53.8516480713, 41.7851648316);
	allPoints[124] = new Point(213, 368, 53.0377224247, 39.5600808897);
	allPoints[125] = new Point(153, 310, 57.5586657246, 45.2769256907);
	allPoints[126] = new Point(86, 292, 89.2748564827, 56.7538544947);
	allPoints[127] = new Point(140, 209, 49.578221025, 46.6904701197);
	allPoints[128] = new Point(210, 202, 41.3400532172, 45.6946386352);
	allPoints[129] = new Point(186, 217, 41.3037528561, 41.3400532172);
	allPoints[130] = new Point(298, 163, 46.1735855225, 46.872166581);
	allPoints[131] = new Point(368, 223, 39.1152144312, 37.947331922);
	allPoints[132] = new Point(312, 270, 43.2897216438, 37.3630833845);
	allPoints[133] = new Point(328, 288, 37.3630833845, 34.885527085);
	allPoints[134] = new Point(385, 277, 30.4630924235, 29.0172362571);
	allPoints[135] = new Point(379, 279, 36.7695526217, 29.0172362571);
	allPoints[136] = new Point(364, 278, 29.0172362571, 29.0172362571);
	allPoints[137] = new Point(456, 167, 22.1359436212, 16.6433169771);
	allPoints[138] = new Point(466, 195, 28.8617393793, 21.5406592285);
	allPoints[139] = new Point(486, 187, 21.5406592285, 21.0237960416);
	allPoints[140] = new Point(449, 188, 29.1547594742, 22.1359436212);
	allPoints[141] = new Point(446, 156, 19.4164878389, 19.1049731745);
	allPoints[142] = new Point(429, 123, 28.6356421266, 21.9317121995);
	allPoints[143] = new Point(457, 129, 23.0867927612, 16.7630546142);
	allPoints[144] = new Point(455, 106, 30.5286750449, 23.0867927612);
	allPoints[145] = new Point(445, 144, 19.1049731745, 16.7630546142);
	allPoints[146] = new Point(407, 150, 29.6816441593, 21.9317121995);
	allPoints[147] = new Point(427, 141, 21.9317121995, 19.1049731745);
	allPoints[148] = new Point(527, 131, 26.9072480941, 19.2093727123);
	allPoints[149] = new Point(524, 165, 23.3452350599, 18.3575597507);
	allPoints[150] = new Point(474, 187, 25.0199920064, 20);
	allPoints[151] = new Point(473, 147, 15.2643375225, 16.7630546142);
	allPoints[152] = new Point(465, 160, 16.6433169771, 15.2643375225);	
	
	rootOfTheTree = new Node();
	for (var i = 0, ii = allPoints.length; i < ii; i++) {
		rootOfTheTree.points[rootOfTheTree.points.length] = allPoints[i];
	}
	
	var L = [];
	L_ORIGINAL = [];
	for (var i = 0, ii = allPoints.length; i < ii; i++) {
		if (i == 0) {
			if (allPoints[i].RD > allPoints[i + 1].RD) {
				L[L.length] = allPoints[i];
				L_ORIGINAL[L_ORIGINAL.length] = allPoints[i];
			}
		} else if (i == ii - 1) {
			if (allPoints[i].RD > allPoints[i - 1].RD) {
				L[L.length] = allPoints[i];		
				L_ORIGINAL[L_ORIGINAL.length] = allPoints[i];
			}
		} else {
			if (allPoints[i].RD > allPoints[i - 1].RD && allPoints[i].RD > allPoints[i + 1].RD) {
				L[L.length] = allPoints[i];
				L_ORIGINAL[L_ORIGINAL.length] = allPoints[i];
			}
		}
	}
	L.sort(function(a,b){return b.RD - a.RD});
	
	// Нарисовать локальные максимумы
	/*for (var i = 0, ii = L.length; i < ii; i++) {
		r.circle(L[i].x, L[i].y, 10).attr("fill", "yellow");
	}*/	
	
	cluster_tree(rootOfTheTree, null, L);
	
	//draw(rootOfTheTree, "red");
	
	//draw(rootOfTheTree.NL.N1, "green");
	//draw(rootOfTheTree.NL.N2, "red");
	
	draw(rootOfTheTree.NL.N1.NL.N1, "green");
	draw(rootOfTheTree.NL.N1.NL.N2, "red");
	
	//draw(rootOfTheTree.NL.N2.NL.N1, "green");
	//draw(rootOfTheTree.NL.N2.NL.N2, "red");	
	
	// Нарисовать все точки
	for (var i = 0, ii = allPoints.length; i < ii; i++) {
		r.circle(allPoints[i].x, allPoints[i].y, 1);
	}	
}  