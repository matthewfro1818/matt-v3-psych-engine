function onCreatePost()
	makeLuaSprite('goddsmitanothersquare', nil, 0, 0)
	luaSpriteMakeGraphic('goddsmitanothersquare', 1, 1, '000000')
	setGraphicSize('goddsmitanothersquare', 3000,3000)
	setScrollFactor('goddsmitanothersquare', 0, 0);
	screenCenter('goddsmitanothersquare');
	addLuaSprite('goddsmitanothersquare', true)
	setProperty('goddsmitanothersquare.alpha', 1)
	setProperty('camHUD.alpha', 0)
	doTweenAlpha('dumbshid2','goddsmitanothersquare', 1 , 2)
end
function onCreate()
	setProperty('skipCountdown', true)
end
function onBeatHit()
	if curBeat == 32 then
		doTweenAlpha('dumbshid2','goddsmitanothersquare', 0 , 0.001)
	end
	if curBeat == 1 then
		doTweenAlpha('dumbshid', 'camHUD', 1 ,3)
	end
	if curBeat == 32 then
		doTweenAlpha('dumbshid', 'camHUD', 1 , 0.001)
	end
	if curBeat == 287 then
		doTweenAlpha('dumbshid2','goddsmitanothersquare', 1 , 2)
	end
	if curBeat == 324 then
		doTweenAlpha('dumbshid2','goddsmitanothersquare', 0 , 0.001)
	end
end