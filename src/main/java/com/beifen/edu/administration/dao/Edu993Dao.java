package com.beifen.edu.administration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu993;

import java.util.List;

public interface Edu993Dao extends JpaRepository<Edu993, Long>, JpaSpecificationExecutor<Edu993> {

	// 根据角色获取通知
//	@Query(value = "select * from edu993 e where e.department_code in ?1 and e.role_id = ?2 and (e.notice_type = '01' or e.notice_type = '02')", nativeQuery = true)
//	public List<Edu993> getNoticesByRole(List<String> departments, String roleId);
	@Query(value = "select * from edu993 e where  e.role_id = ?1 and (e.notice_type = '01' or e.notice_type = '02')", nativeQuery = true)
	public List<Edu993> getNoticesByRole(String roleId);

	// 根据关联人获取通知
	@Query(value = "select * from edu993 e where e.user_id=?1 and e.role_id = ?2", nativeQuery = true)
	public List<Edu993> getNoticesByUser(String userId,String roleId);

	// 根据202id删除
	@Transactional
	@Modifying
	@Query(value = "delete from edu993 e where e.business_id =?1 and e.notice_type = ?2", nativeQuery = true)
	void deleteByBusiness(String scheduleId, String noticeType);
}
