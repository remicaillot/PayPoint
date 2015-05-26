; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "Subtitle Manager"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Weexa Studio"
#define MyAppURL "http://weexastudio.fr"
#define MyAppExeName "Subtitle Manager.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{331E6A5D-12EB-482E-BB64-A9105CE301A7}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=C:\Users\R�mi\Documents\GitHub\Subtitle Manager\Installateur
OutputBaseFilename=Subtitle Manager Setup
SetupIconFile=C:\Users\R�mi\Documents\GitHub\Subtitle Manager\Subtitle-manager\app\data\images\favicon.ico
WizardImageFile=C:\Users\R�mi\Documents\GitHub\Subtitle Manager\Subtitle-manager\app\data\images\wizard_side.bmp
WizardSmallImageFile=C:\Users\R�mi\Documents\GitHub\Subtitle Manager\Subtitle-manager\app\data\images\wizard_little.bmp
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 0,6.1

[Files]
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\Subtitle Manager.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\credits.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\ffmpegsumo.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\nw.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\nwjc.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\pdf.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\am.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ar.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\bg.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\bn.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ca.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\cs.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\da.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\de.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\el.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\en-GB.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\en-US.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\es.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\es-419.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\et.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\fa.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\fi.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\fil.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\fr.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\gu.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\hi.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\hr.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\hu.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\id.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\it.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\iw.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ja.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\kn.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ko.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\lt.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\lv.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ml.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\mr.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ms.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\nl.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\no.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\pl.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\pt-BR.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\pt-PT.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ro.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ru.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\sk.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\sl.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\sr.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\sv.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\sw.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\ta.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\te.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\th.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\tr.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\uk.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\vi.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\zh-CN.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\R�mi\Documents\GitHub\Subtitle Manager\nw\locales\zh-TW.pak"; DestDir: "{app}"; Flags: ignoreversion
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

