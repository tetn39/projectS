def for_chart_weight(ret_user_status):
    for status in ret_user_status:
            if status != 'tempo' and status != 'loudness' and status != 'mode':
                ret_user_status[status] *= 100
                ret_user_status[status] += 20
            
            if status == 'loudness':
                ret_user_status[status] += 90.0
            
            if status == 'tempo':
                ret_user_status[status] /= 2.0

            ret_user_status[status] = float(f'{ret_user_status[status]:.4f}')
    
    return ret_user_status