import { TextInputProps, TouchableOpacityProps, ViewProps } from "react-native";

declare namespace IComponents {
    export interface IHEADERBOOKING extends ViewProps {
        children: string;
        icon?: React.ReactNode;
        onPress?: () => void;
    }

    export interface IBUTTON extends TouchableOpacityProps {
        chilrent?: React.ReactNode;
        loading?: boolean;
        disabled?: boolean;
    }

    export interface ISEARCH extends ViewProps {
        placeholder?: string;
    }

    export interface ICARDPROFILE extends TouchableOpacityProps {
        onPress: () => void;
    }

    export interface IVACCINECARD extends TouchableOpacityProps {
        onPress: () => void;
    }

    export interface IBLOCKINFO extends ViewProps {
        title: string;
        content: string;
    }

    export interface ILINEARGRADIENT extends ViewProps {
        children: React.ReactNode;
        colors?: [string, string, ...string[]];
    }

    export interface IOTPINPUT extends TextInputProps {
        length: number;
        onChangeTextInput: (otp: string) => void;
        name: string;
        control: any;
        rules: any;
    }

}