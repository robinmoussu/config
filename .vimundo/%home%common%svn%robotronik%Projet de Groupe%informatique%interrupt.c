Vim�UnDo� �X���:3s�:�ghr7�5�"��xmQ\qe�   ]       ACLKCON            ,       ,   ,   ,    S5}�    _�                             ����                                                                                                                                                                                                                                                                                                                                                             S5P5     �             �             �             �             �             �              5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             S5P7     �                  �               5�_�                           ����                                                                                                                                                                                                                                                                                                                                                             S5P9     �                 void enableInterrupts()5�_�                    	       ����                                                                                                                                                                                                                                                                                                                                                             S5P9     �                 {}5�_�                           ����                                                                                                                                                                                                                                                                                                                                                             S5P:     �                 void disableInterrupts()5�_�                           ����                                                                                                                                                                                                                                                                                                                                                             S5P:     �                 {}5�_�                           ����                                                                                                                                                                                                                                                                                                                                                             S5P:     �                 void initInterrupts()5�_�      	                     ����                                                                                                                                                                                                                                                                                                                                                             S5P:     �                 {}5�_�      
           	   /        ����                                                                                                                                                                                                                                                                                                                                                             S5PA    �                 // MODIFIED: 2014-03-28 11:34:295�_�   	              
   
        ����                                                                                                                                                                                                                                                                                                                                                             S5PL     �   -   /          IEC1bits.CNIE = 1;�   ,   .          /* Enable CN interrupts */�   +   -          IFS1bits.T4IF = 0;�   *   ,          !/* Reset Timer4 interrupt flag */�   )   +          IFS0bits.T3IF = 0;�   (   *          !/* Reset Timer3 interrupt flag */�   '   )          IFS0bits.T2IF = 0;�   &   (          !/* Reset Timer2 interrupt flag */�   %   '          IFS0bits.T1IF = 0;�   $   &          !/* Reset Timer1 interrupt flag */�   #   %          IPC0bits.T1IP = 2; �   "   $          (/* Set Timer1 interrupt priority to 2 */�   !   #          IPC6bits.T4IP = 3; �       "          (/* Set Timer4 interrupt priority to 3 */�      !          IPC4bits.CNIP = 4;�                 //* Set Change Notice interrupt priority to 4 */�                IPC1bits.T2IP = 5;�                (/* Set Timer2 interrupt priority to 5 */�                 �                IPC2bits.T3IP = 6;�                =/* Set Timer3 interrupt priority to 6 (level 7 is highest) */�                INTCON1bits.NSTDIS = 0;�                $/* Interrupt nesting enabled here */�                return;�                SRbits.IPL = 7;�                9/* No saving of current CPU IPL setting performed here */�                4/* Set CPU IPL to 7, disable level 1-7 interrupts */�                return;�                SRbits.IPL = 0;�   
             ;/* No restoring of previous CPU IPL state performed here */�   	             3/* Set CPU IPL to 0, enable level 1-7 interrupts */5�_�   
                         ����                                                                                                                                                                                                                                                                                                                                                             S5PN    �                 // MODIFIED: 2014-03-28 11:34:415�_�                    /        ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   .              }5�_�                    ;       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   :              void __attribute__()5�_�                    ;       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   :              void __attribute__(())5�_�                    ;   1    ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   :              2void __attribute__((__interrupt__)) _T1Interrupt()5�_�                    <       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   ;              {}5�_�                    A       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   @              void __attribute__()5�_�                    A       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   @              void __attribute__(())5�_�                    A   1    ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   @              2void __attribute__((__interrupt__)) _T2Interrupt()5�_�                    B       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   A              {}5�_�                    G       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   F              void __attribute__()5�_�                    G       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   F              void __attribute__(())5�_�                    G   1    ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   F              2void __attribute__((__interrupt__)) _T3Interrupt()5�_�                    H       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   G              {}5�_�                    M       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   L              void __attribute__()5�_�                    M       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   L              void __attribute__(())5�_�                    M   1    ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   L              2void __attribute__((__interrupt__)) _T4Interrupt()5�_�                    N       ����                                                                                                                                                                                                                                                                                                                                                             S5`�     �   M              {}5�_�                    S       ����                                                                                                                                                                                                                                                                                                                                                             S5a     �   R              void __attribute__()5�_�                    S       ����                                                                                                                                                                                                                                                                                                                                                             S5a     �   R              void __attribute__(())5�_�                     S   1    ����                                                                                                                                                                                                                                                                                                                                                             S5a     �   R              2void __attribute__((__interrupt__)) _CNInterrupt()5�_�      !               T       ����                                                                                                                                                                                                                                                                                                                                                             S5a     �   S              {}5�_�       "           !   =        ����                                                                                                                                                                                                                                                                                                                                                             S5a"   
 �   V   X          IFS1bits.CNIF = 0;�   U   W          /* Clear CN interrupt */�   T   V          /* Insert ISR Code Here*/�   P   R          IFS1bits.T4IF = 0;�   O   Q          /* Clear Timer4 interrupt */�   N   P          /* Insert ISR Code Here*/�   J   L          IFS0bits.T3IF = 0;�   I   K          /* Clear Timer3 interrupt */�   H   J          /* Insert ISR Code Here*/�   D   F          IFS0bits.T2IF = 0;�   C   E          /* Clear Timer2 interrupt */�   B   D          /* Insert ISR Code Here*/�   >   @          IFS0bits.T1IF = 0;�   =   ?          /* Clear Timer1 interrupt */�   <   >          /* Insert ISR Code Here*/5�_�   !   #           "           ����                                                                                                                                                                                                                                                                                                                                                             S5a    �                 // MODIFIED: 2014-03-28 11:34:545�_�   "   $           #           ����                                                                                                                                                                                                                                                                                                                                                             S5a�    �                 // MODIFIED: 2014-03-28 12:48:155�_�   #   %           $           ����                                                                                                                                                                                                                                                                                                                                       #           V        S5v�     �      
   Y       �      	   X    5�_�   $   &           %   	       ����                                                                                                                                                                                                                                                                                                                                       %           V        S5v�     �         Z      {}5�_�   %   '           &   
        ����                                                                                                                                                                                                                                                                                                                                        &           V        S5v�     �   	      \          �   	      [    5�_�   &   (           '           ����                                                                                                                                                                                                                                                                                                                            #           )           V        S5w�     �         ^       5�_�   '   )           (           ����                                                                                                                                                                                                                                                                                                                            #           )           V        S5w�     �         ^       5�_�   (   +           )          ����                                                                                                                                                                                                                                                                                                                            #           )           V        S5w�     �                
        DD5�_�   )   ,   *       +          ����                                                                                                                                                                                                                                                                                                                            "           (           V        S5}�     �   
                 ACLKCON5�_�   +               ,          ����                                                                                                                                                                                                                                                                                                                            "           (           V        S5}�    �                 // MODIFIED: 2014-03-28 12:48:175�_�   )           +   *          ����                                                                                                                                                                                                                                                                                                                            "           (           V        S5w�     �   
      ]          ACLKCON = :q5��